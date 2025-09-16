import connect from "@/lib/db";
import { LoginUser } from "@/lib/models/LoginUsers";
import { Staff } from "@/lib/models/Staff";
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
    const email = searchParams.get("email");

    // Get specific staff by ID
    if (id) {
      if (!isValidObjectId(id)) {
        return errorResponse("Invalid staff ID format", 400);
      }

      const staffData = await Staff.findById(id);
      if (!staffData) {
        return errorResponse("Staff member not found", 404);
      }

      return successResponse(staffData, "Staff member retrieved successfully");
    }

    // Get specific staff by email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return errorResponse("Invalid email format", 400);
      }

      const staffData = await Staff.findOne({ email });
      if (!staffData) {
        return errorResponse("Staff member not found with this email", 404);
      }

      return successResponse(staffData, "Staff member retrieved successfully");
    }

    // Get all staff members
    const staffData = await Staff.find().sort({ createdAt: -1 });

    return successResponse(
      staffData,
      `Retrieved ${staffData.length} staff member(s) successfully`
    );
  } catch (error: unknown) {
    console.error("GET /staff error:", error);
    return errorResponse("Failed to fetch staff data", 500, error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const data = await req.json();

    // Validate required fields
    if (!data.email) {
      return errorResponse("Email is required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return errorResponse("Invalid email format", 400);
    }

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email: data.email });
    if (existingStaff) {
      return errorResponse("Staff member already exists with this email", 409);
    }

    // Check if login user already exists
    const existingLoginUser = await LoginUser.findOne({ email: data.email });
    if (existingLoginUser) {
      return errorResponse("User already exists with this email", 409);
    }

    const { password, ...staffData } = data;
    console.log(password);

    // Create new staff member
    const newStaff = new Staff(staffData);
    const savedStaff = await newStaff.save();

    // Create login user entry
    const loginPayload = {
      email: data.email,
      userType: "staff",
    };
    const newLoginUser = new LoginUser(loginPayload);
    await newLoginUser.save();

    return successResponse(
      savedStaff,
      "Staff member created successfully",
      201
    );
  } catch (error: unknown) {
    console.error("POST /staff error:", error);

    // Handle mongoose validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }

    return errorResponse("Failed to create staff member", 500, error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Staff ID is required for update", 400);
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid staff ID format", 400);
    }

    const data = await req.json();

    // Remove sensitive fields that shouldn't be updated directly
    const { password, ...updateData } = data;
    console.log(password);

    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return errorResponse("Invalid email format", 400);
      }

      // Check if email is already used by another staff member
      const existingStaff = await Staff.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingStaff) {
        return errorResponse(
          "Email already exists for another staff member",
          409
        );
      }
    }

    // Find and update the staff member
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return errorResponse("Staff member not found", 404);
    }

    // Update email in LoginUser if email was changed
    if (updateData.email) {
      await LoginUser.findOneAndUpdate(
        { staffId: id },
        { email: updateData.email }
      );
    }

    return successResponse(updatedStaff, "Staff member updated successfully");
  } catch (error: unknown) {
    console.error("PUT /staff error:", error);

    // Handle mongoose validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return errorResponse("Validation failed", 400, error);
    }

    return errorResponse("Failed to update staff member", 500, error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Staff ID is required for deletion", 400);
    }

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid staff ID format", 400);
    }

    // Find the staff member first to get their email
    const staffToDelete = await Staff.findById(id);
    if (!staffToDelete) {
      return errorResponse("Staff member not found", 404);
    }

    // Delete the staff member
    const deletedStaff = await Staff.findByIdAndDelete(id);

    // Delete the corresponding login user entry
    await LoginUser.findOneAndDelete({
      $or: [{ email: staffToDelete.email }, { staffId: id }],
    });

    return successResponse(deletedStaff, "Staff member deleted successfully");
  } catch (error: unknown) {
    console.error("DELETE /staff error:", error);
    return errorResponse("Failed to delete staff member", 500, error);
  }
};
