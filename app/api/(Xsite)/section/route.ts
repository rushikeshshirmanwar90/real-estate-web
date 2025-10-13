import connect from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { Section } from "@/lib/models/Xsite/Section";
import { NextRequest } from "next/server";

interface projectDetailProps {
  projectName: string;
  projectId: string;
}

interface mainSectionDetailProps {
  sectionName: string;
  sectionId: string;
}

interface payloadProps {
  name: string;
  projectDetails: projectDetailProps;
  mainSectionDetails: mainSectionDetailProps;
}

export const GET = async (req: NextRequest | Request) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const projectId = searchParams.get("projectId");
  const sectionId = searchParams.get("sectionId");

  if (!id && !projectId && !sectionId) {
    errorResponse(
      "{id, projectId, sectionId} from this at least one parameter is required",
      400
    );
  }

  if (projectId && !sectionId) {
    errorResponse("with projectId, sectionId is also required", 400);
  }

  try {
    if (id) {
      const sectionData = await Section.findById(id);
      if (!sectionData) {
        errorResponse("data not found", 204);
      }
      successResponse(sectionData, "Section data fetched successfully", 200);
    } else if (sectionId) {
      const sectionData = await Section.find({
        "mainSectionDetails.sectionId": sectionId,
      });

      if (!sectionData) {
        errorResponse("data not found", 204);
      }

      successResponse(sectionData, "Section data fetched successfully", 200);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const POST = async (req: NextRequest | Request) => {
  await connect();

  try {
    const data: payloadProps = await req.json();

    const newSection = await new Section(data);
    await newSection.save();

    if (newSection) {
      successResponse(newSection, "section created successfully", 201);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const PUT = async (req: NextRequest | Request) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) errorResponse("sectionId is required", 406);

    const { name } = await req.json();

    if (!name) {
      errorResponse("only name can update", 406);
    }

    const updatedData = await Section.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    await updatedData.save();

    successResponse(updatedData, "data updated successfully", 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      errorResponse("id is required", 406);
    }

    const removedData = await Section.findByIdAndDelete(id);

    if (removedData) {
      return successResponse(removedData, "data deleted successfully", 200);
    } else {
      return errorResponse(`data not found with this id : ${id}`, 406);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};
