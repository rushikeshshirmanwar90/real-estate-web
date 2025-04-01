import connect from "@/lib/db";
import { CustomerDetails } from "@/lib/models/CustomerDetails";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId not found" },
        { status: 404 }
      );
    }

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid userId format", error },
        { status: 400 }
      );
    }

    const property = await CustomerDetails.findOne({ userId: objectId });

    if (!property) {
      return NextResponse.json(
        { message: "Can't find properties for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't fetch the data", error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();
    const { userId, ...propertyData } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    // Convert userId string to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid userId format", error },
        { status: 400 }
      );
    }

    // Check if a CustomerDetails document exists for this user
    const existingCustomer = await CustomerDetails.findOne({
      userId: objectId,
    });
    let result;

    if (existingCustomer) {
      // Validate property data against schema requirements
      if (
        !propertyData.projectId ||
        !propertyData.projectName ||
        !propertyData.sectionId ||
        !propertyData.sectionName ||
        !propertyData.sectionType
      ) {
        return NextResponse.json(
          { message: "Missing required property fields" },
          { status: 400 }
        );
      }

      // If customer details exists, update the property array
      result = await CustomerDetails.findOneAndUpdate(
        { userId: objectId },
        {
          $push: {
            property: propertyData,
          },
        },
        { new: true }
      );
    } else {
      // Validate property data for new document
      if (
        !propertyData.projectId ||
        !propertyData.projectName ||
        !propertyData.sectionId ||
        !propertyData.sectionName ||
        !propertyData.sectionType
      ) {
        return NextResponse.json(
          { message: "Missing required property fields" },
          { status: 400 }
        );
      }

      // If customer details doesn't exist, create a new document
      result = await CustomerDetails.create({
        userId: objectId,
        property: [propertyData],
      });
    }

    if (!result) {
      return NextResponse.json(
        { message: "Failed to update or create customer data" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Can't add the property data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If userId is provided, delete only that user's data
    if (userId) {
      // Convert userId string to ObjectId
      let objectId;
      try {
        objectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        return NextResponse.json(
          { message: "Invalid userId format", error },
          { status: 400 }
        );
      }

      const deletedData = await CustomerDetails.findOneAndDelete({
        userId: objectId,
      });

      if (!deletedData) {
        return NextResponse.json(
          { message: "User not found or already deleted" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "User data deleted successfully", deletedData },
        { status: 200 }
      );
    }
    // Otherwise delete all data (admin functionality)
    else {
      const deletedData = await CustomerDetails.deleteMany({});

      if (!deletedData || deletedData.deletedCount === 0) {
        return NextResponse.json(
          { message: "No data found to delete" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "All customer data deleted successfully", deletedData },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to delete data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();
    const { userId, propertyId, ...updateData } = body;

    if (!userId || !propertyId) {
      return NextResponse.json(
        { message: "userId and propertyId are required" },
        { status: 400 }
      );
    }

    // Convert userId string to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid userId format", error },
        { status: 400 }
      );
    }

    // Update a specific property in the array
    const result = await CustomerDetails.findOneAndUpdate(
      {
        userId: objectId,
        "property._id": propertyId,
      },
      {
        $set: {
          "property.$": { _id: propertyId, ...updateData },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { message: "User or property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Can't update the property data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

// Add a new endpoint to add a payment to a specific property
export const PATCH = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();
    const { userId, propertyId, payment } = body;

    if (!userId || !propertyId || !payment) {
      return NextResponse.json(
        { message: "userId, propertyId and payment details are required" },
        { status: 400 }
      );
    }

    // Validate payment object
    if (!payment.title || !payment.percentage || !payment.date) {
      return NextResponse.json(
        { message: "Payment must include title, percentage, and date" },
        { status: 400 }
      );
    }

    // Convert userId string to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid userId format", error },
        { status: 400 }
      );
    }

    // Add payment to specific property
    const result = await CustomerDetails.findOneAndUpdate(
      {
        userId: objectId,
        "property._id": propertyId,
      },
      {
        $push: {
          "property.$.payments": payment,
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { message: "User or property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Can't add payment data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
