import { Projects } from "@/lib/models/Project";
import { connectDB } from "@/lib/utils/db-connection";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { isValidObjectId } from "@/lib/utils/validation";
import {
  getPaginationParams,
  createPaginationMeta,
} from "@/lib/utils/pagination";
import { logger } from "@/lib/utils/logger";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return errorResponse("Client ID is required", 400);
    }

    if (!isValidObjectId(clientId)) {
      return errorResponse("Invalid client ID format", 400);
    }

    await connectDB();

    if (id) {
      if (!isValidObjectId(id)) {
        return errorResponse("Invalid project ID format", 400);
      }

      const project = await Projects.findOne({
        _id: new ObjectId(id),
        clientId: new ObjectId(clientId),
      }).lean();

      if (!project) {
        return errorResponse("Project not found", 404);
      }

      return successResponse(project, "Project retrieved successfully");
    }

    // Pagination
    const { page, limit, skip } = getPaginationParams(req);

    const [projects, total] = await Promise.all([
      Projects.find({ clientId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Projects.countDocuments({ clientId }),
    ]);

    const meta = createPaginationMeta(page, limit, total);

    return successResponse(
      { projects, meta },
      `Retrieved ${projects.length} project(s) successfully`
    );
  } catch (error: unknown) {
    logger.error("Error fetching projects", error);
    return errorResponse("Failed to fetch projects", 500);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    if (!body.clientId) {
      return errorResponse("Client ID is required", 400);
    }

    if (!isValidObjectId(body.clientId)) {
      return errorResponse("Invalid client ID format", 400);
    }

    const formattedBody = {
      ...body,
      clientId: new ObjectId(body.clientId),
    };

    const newProject = new Projects(formattedBody);
    await newProject.save();

    return successResponse(newProject, "Project created successfully", 201);
  } catch (error: unknown) {
    logger.error("Error creating project", error);

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }

    return errorResponse("Failed to create project", 500);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return errorResponse("Project ID is required", 400);
    }

    if (!isValidObjectId(projectId)) {
      return errorResponse("Invalid project ID format", 400);
    }

    const deletedProject = await Projects.findByIdAndDelete(projectId).lean();

    if (!deletedProject) {
      return errorResponse("Project not found", 404);
    }

    return successResponse(deletedProject, "Project deleted successfully");
  } catch (error: unknown) {
    logger.error("Error deleting project", error);
    return errorResponse("Failed to delete project", 500);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Project ID is required", 400);
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid project ID format", 400);
    }

    const body = await req.json();

    const updatedProject = await Projects.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) {
      return errorResponse("Project not found", 404);
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
