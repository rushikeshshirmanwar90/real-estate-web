import { Projects } from "@/lib/models/Project";
import connect from "@/lib/db";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { isValidObjectId } from "@/lib/utils/validation";
import { logger } from "@/lib/utils/logger";
import { requireValidClient } from "@/lib/utils/client-validation";
import { logActivity, extractUserInfo } from "@/lib/utils/activity-logger";

// GET single project by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return errorResponse("Client ID is required", 400);
    }

    if (!isValidObjectId(clientId)) {
      return errorResponse("Invalid client ID format", 400);
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid project ID format", 400);
    }

    await connect();

    // Validate client exists
    try {
      await requireValidClient(clientId);
    } catch (clientError) {
      if (clientError instanceof Error) {
        return errorResponse(clientError.message, 404);
      }
      return errorResponse("Client validation failed", 404);
    }

    const project = await Projects.findOne({
      _id: new ObjectId(id),
      clientId: new ObjectId(clientId),
    }).lean();

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    return successResponse(project, "Project retrieved successfully");
  } catch (error: unknown) {
    logger.error("Error fetching project", error);
    return errorResponse("Failed to fetch project", 500);
  }
};

// DELETE project by ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid project ID format", 400);
    }

    await connect();

    // Find the project first to get client info for logging
    const existingProject = await Projects.findById(id).lean();
    if (!existingProject) {
      return errorResponse("Project not found", 404);
    }

    // Delete the project
    const deletedProject = await Projects.findByIdAndDelete(id).lean();

    if (!deletedProject) {
      return errorResponse("Project not found", 404);
    }

    // Log activity for project deletion
    const userInfo = extractUserInfo(req);
    if (userInfo && deletedProject) {
      try {
        await logActivity({
          user: userInfo,
          clientId: deletedProject.clientId?.toString() || 'unknown',
          projectId: deletedProject._id.toString(),
          projectName: deletedProject.projectName || deletedProject.name || 'Deleted Project',
          activityType: "project_deleted",
          category: "project",
          action: "delete",
          description: `Deleted project: ${deletedProject.projectName || deletedProject.name || 'Unnamed Project'}`,
          message: `Project deleted successfully`,
          metadata: {
            deletedProjectData: {
              name: deletedProject.projectName || deletedProject.name,
              location: deletedProject.location,
              type: deletedProject.type
            }
          }
        });
      } catch (activityError) {
        logger.error("Failed to log delete activity", activityError);
        // Don't fail the delete operation if activity logging fails
      }
    } else {
      console.log('⚠️ No user info available for delete activity logging - skipping activity log');
    }

    return successResponse(deletedProject, "Project deleted successfully");
  } catch (error: unknown) {
    logger.error("Error deleting project", error);
    return errorResponse("Failed to delete project", 500);
  }
};

// PUT update project by ID
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid project ID format", 400);
    }

    await connect();

    const body = await req.json();

    // Validate required fields for update
    if (body.clientId && !isValidObjectId(body.clientId)) {
      return errorResponse("Invalid client ID format", 400);
    }

    // Find existing project first
    const existingProject = await Projects.findById(id).lean();
    if (!existingProject) {
      return errorResponse("Project not found", 404);
    }

    // Prepare update data
    const updateData = { ...body };
    if (updateData.clientId) {
      updateData.clientId = new ObjectId(updateData.clientId);
    }

    // Update the project
    const updatedProject = await Projects.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) {
      return errorResponse("Project not found", 404);
    }

    // Log activity for project update
    const userInfo = extractUserInfo(req, body);
    if (userInfo) {
      try {
        await logActivity({
          user: userInfo,
          clientId: updatedProject.clientId?.toString() || 'unknown',
          projectId: updatedProject._id.toString(),
          projectName: updatedProject.projectName || updatedProject.name || 'Updated Project',
          activityType: "project_updated",
          category: "project",
          action: "update",
          description: `Updated project: ${updatedProject.projectName || updatedProject.name || 'Unnamed Project'}`,
          message: `Project updated successfully`,
          changedData: Object.keys(body).filter(key => key !== 'user').map(field => ({
            field,
            newValue: body[field]
          })),
          metadata: {
            updatedFields: Object.keys(body).filter(key => key !== 'user'),
            projectData: {
              name: updatedProject.projectName || updatedProject.name,
              location: updatedProject.location,
              type: updatedProject.type
            }
          }
        });
      } catch (activityError) {
        logger.error("Failed to log update activity", activityError);
        // Don't fail the update operation if activity logging fails
      }
    } else {
      console.log('⚠️ No user info available for update activity logging - skipping activity log');
    }

    return successResponse(updatedProject, "Project updated successfully");
  } catch (error: unknown) {
    logger.error("Error updating project", error);
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }
    return errorResponse("Failed to update project", 500);
  }
};