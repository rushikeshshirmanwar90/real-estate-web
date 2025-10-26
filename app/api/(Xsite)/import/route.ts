import connect from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { NextRequest } from "next/server";
import { RequestedMaterial } from "@/lib/models/Xsite/request-material";
import { Projects } from "@/lib/models/Project";
import { MiniSection as Section } from "@/lib/models/Xsite/mini-section";

export const POST = async (req: NextRequest | Request) => {
  try {
    const { requestId } = await req.json();

    // Validate requestId
    if (!requestId) {
      return errorResponse("requestId is required", 400);
    }

    await connect();

    // Find the requested material
    const findRequestMaterial = await RequestedMaterial.findById(requestId);

    if (!findRequestMaterial) {
      return errorResponse("Material request not found", 404);
    }

    // Check if request is approved
    if (findRequestMaterial.status === "pending") {
      return errorResponse("Request is not approved yet", 400);
    }

    // Check if already imported
    if (findRequestMaterial.status === "imported") {
      return errorResponse("Material request already imported", 409);
    }

    const { projectId, mainSectionId, sectionId, materials } =
      findRequestMaterial;

    // Validate required fields
    if (
      !projectId ||
      !mainSectionId ||
      !materials ||
      !sectionId ||
      materials.length === 0
    ) {
      return errorResponse("Invalid request material data", 400);
    }

    // Find the project
    const projectData = await Projects.findById(projectId);

    if (!projectData) {
      return errorResponse("Project not found", 404);
    }

    // Find the section with matching mainSectionId
    const sectionIndex = projectData.section?.findIndex(
      (sec: { sectionId: string }) => sec.sectionId === mainSectionId
    );

    if (sectionIndex === -1 || sectionIndex === undefined) {
      return errorResponse("Section not found in the project", 404);
    }

    // Verify section exists before updating
    const sectionExists = await Section.findById(sectionId);

    if (!sectionExists) {
      return errorResponse("Section record not found in database", 404);
    }

    // Perform all updates in parallel for better performance
    const [updatedProject, updatedSection, updatedRequest] = await Promise.all([
      // Update main project MaterialAvailable
      Projects.findByIdAndUpdate(
        projectId,
        {
          $push: {
            MaterialAvailable: { $each: materials },
          },
        },
        { new: true, runValidators: true }
      ),

      // Update specific section MaterialAvailable in project
      Projects.findByIdAndUpdate(
        projectId,
        {
          $push: {
            [`section.${sectionIndex}.MaterialAvailable`]: {
              $each: materials,
            },
          },
        },
        { new: true, runValidators: true }
      ),

      // Update section collection
      Section.findByIdAndUpdate(
        sectionId,
        {
          $push: {
            MaterialAvailable: { $each: materials },
          },
        },
        { new: true, runValidators: true }
      ),
    ]);

    // Check if any update failed
    if (!updatedProject || !updatedSection || !updatedRequest) {
      return errorResponse("Failed to update materials in all locations", 500);
    }

    // Update material request status
    const updateMaterialRequest = await RequestedMaterial.findByIdAndUpdate(
      requestId,
      {
        status: "imported",
      },
      { new: true, runValidators: true }
    );

    if (!updateMaterialRequest) {
      return errorResponse("Failed to update material request status", 500);
    }

    // Return success response
    return successResponse(
      findRequestMaterial,
      "material imported successfully",
      200
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/import-material:", error);

    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }

    return errorResponse("Unknown error occurred", 500);
  }
};
