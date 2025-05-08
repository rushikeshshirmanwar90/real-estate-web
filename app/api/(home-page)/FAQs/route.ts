import connect from "@/lib/db";
import { FAQ } from "@/lib/models/homepage/FAQ";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // Get clientId from query params if provided
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    await connect();

    // If clientId is provided, filter by it
    const query = clientId ? { clientId } : {};
    const data = await FAQ.find(query);

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No FAQ data found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching FAQ data:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch FAQ data",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const body = await req.json();

    // Basic validation
    if (
      !body.clientId ||
      !body.subTitle ||
      !Array.isArray(body.FAQs) ||
      body.FAQs.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: clientId, subTitle, and FAQs array",
        },
        { status: 400 }
      );
    }

    // Check if FAQ data already exists for this client
    const existingData = await FAQ.findOne({ clientId: body.clientId });
    if (existingData) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ data already exists for this client",
        },
        { status: 409 }
      );
    }

    const newFAQ = new FAQ(body);
    const savedFAQ = await newFAQ.save();

    return NextResponse.json(
      {
        success: true,
        message: "FAQ data created successfully",
        data: savedFAQ,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating FAQ data:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create FAQ data",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID parameter is required",
        },
        { status: 400 }
      );
    }

    await connect();
    const deletedData = await FAQ.findByIdAndDelete(id);

    if (!deletedData) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ data not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "FAQ data deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting FAQ data:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete FAQ data",
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID parameter is required",
        },
        { status: 400 }
      );
    }

    await connect();
    const body = await req.json();

    // Basic validation
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No update data provided",
        },
        { status: 400 }
      );
    }

    const updatedData = await FAQ.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true, // Run schema validators on update
    });

    if (!updatedData) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ data not found or couldn't be updated",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "FAQ data updated successfully",
        data: updatedData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating FAQ data:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update FAQ data",
      },
      { status: 500 }
    );
  }
};
