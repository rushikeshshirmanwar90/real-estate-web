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
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  if (!sectionId) {
    return errorResponse(
      "sectionId from this at least one parameter is required",
      400
    );
  }

  try {
    await connect();

    if (sectionId) {
      const sectionData = await Section.find({
        "mainSectionDetails.sectionId": sectionId,
      });

      if (!sectionData) {
        return errorResponse("data not found", 204);
      }

      return successResponse(
        sectionData,
        "Section data fetched successfully",
        200
      );
    } else {
      return errorResponse("something went wrong in params", 406);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const data: payloadProps = await req.json();

    const newSection = await new Section(data);
    await newSection.save();

    if (newSection) {
      return successResponse(newSection, "section created successfully", 201);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const PUT = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connect();

    if (!id) return errorResponse("sectionId is required", 406);

    const { name } = await req.json();

    if (!name) {
      return errorResponse("only name can update", 406);
    }

    const updatedData = await Section.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    await updatedData.save();

    return successResponse(updatedData, "data updated successfully", 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connect();

    if (id) {
      return errorResponse("id is required", 406);
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
