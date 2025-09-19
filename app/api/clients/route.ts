import bcrypt from "bcrypt";
import connect from "@/lib/db";
import { Client } from "@/lib/models/super-admin/Client";
import { NextRequest, NextResponse } from "next/server";
import { LoginUser } from "@/lib/models/LoginUsers";
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

    // Get specific Client by ID
    if (id) {
      if (!isValidObjectId(id)) {
        return errorResponse("Invalid staff ID format", 400);
      }

      const clientData = await Client.findById(id);
      if (!clientData) {
        return errorResponse("Client not found", 404);
      }

      return successResponse(clientData, "Client retrieved successfully");
    }

    // Get specific client by email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return errorResponse("Invalid email format", 400);
      }

      const clientData = await Client.findOne({ email });
      if (!clientData) {
        return errorResponse("Client not found with this email", 404);
      }

      return successResponse(clientData, "Client retrieved successfully");
    }

    // Get all client members
    const clientData = await Client.find().sort({ createdAt: -1 });

    return successResponse(
      clientData,
      `Retrieved ${clientData.length} clients(s) successfully`
    );
  } catch (error: unknown) {
    console.error("GET /client error:", error);
    return errorResponse("Failed to fetch client data", 500, error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const data = await req.json();
    const saltRounds = parseInt(process.env.SALT_ID!, 10);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    const addClient = new Client(data);
    await addClient.save();

    const { email, ...otherData } = data;

    console.log(otherData);
    const payload = { email, userType: "client" };
    const newEntry = new LoginUser(payload);
    await newEntry.save();

    return NextResponse.json({ message: "Client added successfully" });
  } catch (error: unknown) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "An error occurred", error: error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 402 }
      );
    }

    await connect();

    const deletedClient = await Client.findOneAndDelete({ email });
    const deletedLoginUser = await LoginUser.findOneAndDelete({ email });

    if (!deletedClient || !deletedLoginUser) {
      return NextResponse.json(
        { message: "Something went wrong can't Delete Client" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Client Deleted Successfully",
      data: deletedClient,
    });
  } catch (error: unknown) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Id Not Found" },
        {
          status: 404,
        }
      );
    }

    const { name, city, address, area } = await req.json();

    const updatedUser = await Client.findByIdAndUpdate(
      id,
      {
        name,
        city,
        address,
        area,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Something went wrong can't update user",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
};
