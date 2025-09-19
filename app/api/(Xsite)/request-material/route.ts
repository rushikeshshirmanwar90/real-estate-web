import connect from "@/lib/db";
import { RequestedMaterial } from "@/lib/models/Xsite/request-material";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

// Helper function for error responses
const errorResponse = (message: string, status: number, error?: unknown) => {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(error && typeof error === "object"
        ? { error: error instanceof Error ? error.message : error }
        : {}),
    },
    { status }
  );
};

// Helper function for success responses
const successResponse = (
  data: unknown,
  message?: string,
  status: number = 200
) => {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status }
  );
};

export const GET = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clientId = searchParams.get("clientId");
    const projectId = searchParams.get("projectId");

    // Get specific requested material by ID
    if (id) {
      if (!isValidObjectId(id)) {
        return errorResponse("Invalid requested material ID format", 400);
      }

      const requestedMaterial = await RequestedMaterial.findById(id);
      if (!requestedMaterial) {
        return errorResponse("Requested material not found", 404);
      }

      return successResponse(
        requestedMaterial,
        "Requested material retrieved successfully"
      );
    }

    // Get requested materials by client ID
    if (clientId) {
      const requestedMaterials = await RequestedMaterial.find({
        clientId,
      }).sort({ createdAt: -1 });

      return successResponse(
        requestedMaterials,
        `Retrieved ${requestedMaterials.length} requested material(s) for client successfully`
      );
    }

    // Get requested materials by project ID
    if (projectId) {
      const requestedMaterials = await RequestedMaterial.find({
        projectId,
      }).sort({ createdAt: -1 });

      return successResponse(
        requestedMaterials,
        `Retrieved ${requestedMaterials.length} requested material(s) for project successfully`
      );
    }

    // Get all requested materials
    const requestedMaterials = await RequestedMaterial.find().sort({
      createdAt: -1,
    });

    return successResponse(
      requestedMaterials,
      `Retrieved ${requestedMaterials.length} requested material(s) successfully`
    );
  } catch (error: unknown) {
    console.error("GET /requested-materials error:", error);
    return errorResponse(
      "Failed to fetch requested materials data",
      500,
      error
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const data = await req.json();

    // Validate required fields
    if (!data.clientId) {
      return errorResponse("Client ID is required", 400);
    }

    if (!data.projectId) {
      return errorResponse("Project ID is required", 400);
    }

    if (!data.materials) {
      return errorResponse("Materials array is required", 400);
    }

    // Create new requested material
    const newRequestedMaterial = new RequestedMaterial(data);
    const savedRequestedMaterial = await newRequestedMaterial.save();

    return successResponse(
      savedRequestedMaterial,
      "Requested material created successfully",
      201
    );
  } catch (error: unknown) {
    console.error("POST /requested-materials error:", error);

    // Handle mongoose validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }

    return errorResponse("Failed to create requested material", 500, error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Requested material ID is required for update", 400);
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid requested material ID format", 400);
    }

    const data = await req.json();

    // Find and update the requested material
    const updatedRequestedMaterial = await RequestedMaterial.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedRequestedMaterial) {
      return errorResponse("Requested material not found", 404);
    }

    return successResponse(
      updatedRequestedMaterial,
      "Requested material updated successfully"
    );
  } catch (error: unknown) {
    console.error("PUT /requested-materials error:", error);

    // Handle mongoose validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }

    return errorResponse("Failed to update requested material", 500, error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse(
        "Requested material ID is required for deletion",
        400
      );
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid requested material ID format", 400);
    }

    // Find and delete the requested material
    const deletedRequestedMaterial =
      await RequestedMaterial.findByIdAndDelete(id);

    if (!deletedRequestedMaterial) {
      return errorResponse("Requested material not found", 404);
    }

    return successResponse(
      deletedRequestedMaterial,
      "Requested material deleted successfully"
    );
  } catch (error: unknown) {
    console.error("DELETE /requested-materials error:", error);
    return errorResponse("Failed to delete requested material", 500, error);
  }
};
