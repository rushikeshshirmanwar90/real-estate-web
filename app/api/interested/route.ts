import connect from "@/lib/db";
import { Interested } from "@/lib/models/Interested";
import { NextRequest, NextResponse } from "next/server";

// GET all interested records or a specific one by ID
export const GET = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connect();

    if (id) {
      const interested = await Interested.findById(id);
      if (!interested) {
        return NextResponse.json(
          {
            message: "interested record not found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(interested);
    }

    const allInterested = await Interested.find();
    if (!allInterested || allInterested.length === 0) {
      return NextResponse.json(
        {
          message: "no interested records found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(allInterested);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error fetching interested records",
        error: error,
      },
      { status: 500 }
    );
  }
};

// POST a new interested record
export const POST = async (req: NextRequest | Request) => {
  try {
    const body = await req.json();
    await connect();

    const interested = new Interested(body);
    await interested.save();

    if (!interested) {
      return NextResponse.json(
        {
          message: "interested record not created",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "interested record created successfully", interested },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "can't add the interested record",
        error: error,
      },
      { status: 500 }
    );
  }
};

// PUT/UPDATE an interested record
export const PUT = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "ID is required for updating an interested record",
        },
        { status: 400 }
      );
    }

    const updatedInterested = await Interested.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedInterested) {
      return NextResponse.json(
        {
          message: "interested record not found or not updated",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "interested record updated successfully",
        interested: updatedInterested,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error updating interested record",
        error: error,
      },
      { status: 500 }
    );
  }
};

// DELETE an interested record
export const DELETE = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "ID is required for deleting an interested record",
        },
        { status: 400 }
      );
    }

    const deletedInterested = await Interested.findByIdAndDelete(id);

    if (!deletedInterested) {
      return NextResponse.json(
        {
          message: "interested record not found or not deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "interested record deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error deleting interested record",
        error: error,
      },
      { status: 500 }
    );
  }
};
