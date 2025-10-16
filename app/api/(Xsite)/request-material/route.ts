import connect from "@/lib/db";
import { Projects } from "@/lib/models/Project";
import { Section } from "@/lib/models/Xsite/Section";
import { RequestedMaterial } from "@/lib/models/Xsite/request-material";
import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const mainSectionId = searchParams.get("mainSectionId");
  const sectionId = searchParams.get("sectionId");

  try {
    await connect();
    if (projectId) {
      const getMaterials = await RequestedMaterial.find({ projectId });
      if (!getMaterials) {
        return errorResponse(
          `can't able to get Requested Material with mentioned projectId : ${projectId}`,
          404
        );
      }
      return successResponse(getMaterials, "Data fetched successfully", 200);
    } else if (mainSectionId) {
      const getMaterials = await RequestedMaterial.find({ mainSectionId });
      if (!getMaterials) {
        return errorResponse(
          `can't able to get Requested Material with mentioned MainSectionId : ${mainSectionId}`,
          404
        );
      }
      return successResponse(getMaterials, "Data fetched successfully", 200);
    } else if (sectionId) {
      const getMaterials = await RequestedMaterial.find({ sectionId });
      if (!getMaterials) {
        return errorResponse(
          `can't able to get Requested Material with mentioned sectionId : ${sectionId}`,
          404
        );
      }
      return successResponse(getMaterials, "Data fetched successfully", 200);
    } else {
      return errorResponse("invalid params", 406);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { projectId, sectionId, mainSectionId, materials, message } =
      await req.json();

    if (!projectId || !sectionId || !mainSectionId) {
      return errorResponse(
        "projectId, sectionId, and mainSectionId are all required",
        406
      );
    }

    if (!Array.isArray(materials) || materials.length === 0) {
      return errorResponse("Materials array cannot be empty", 406);
    }

    const getProject = await Projects.findById(projectId);
    if (!getProject) {
      return errorResponse("Project not found", 404);
    }

    const getSection = await Section.findById(sectionId);
    if (!getSection) {
      return errorResponse("Section not found", 404);
    }

    const clientId = getProject.clientId;

    const sectionMatch = getProject.section.find(
      (sec: { sectionId: string }) => sec.sectionId === mainSectionId
    );
    if (!sectionMatch) {
      return errorResponse("mainSectionId not found in this project", 406);
    }

    if (
      getSection.projectDetails?.projectId &&
      getSection.projectDetails.projectId.toString() !== projectId
    ) {
      return errorResponse("Section does not belong to this project", 406);
    }

    // ✅ Prepare payload
    const payload = {
      clientId,
      projectId,
      mainSectionId,
      sectionId,
      materials,
      message,
    };

    const newRequestMaterial = new RequestedMaterial(payload);
    await newRequestMaterial.save();

    return successResponse(
      newRequestMaterial,
      "Material request created successfully",
      201
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse(
        "Requested material id is required for deletion",
        406
      );
    }

    const deletedRequest = await RequestedMaterial.findByIdAndDelete(id);

    if (!deletedRequest) {
      return errorResponse("Requested material not found", 404);
    }

    return successResponse(
      deletedRequest,
      "Requested material deleted successfully",
      200
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};
