import connect from "@/lib/db";
import RoomUpdate from "@/lib/models/RoomUpdate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const flatId = searchParams.get("flatId");

    let roomUpdates;
    if (flatId) {
      roomUpdates = await RoomUpdate.findById(flatId);
    } else {
      roomUpdates = await RoomUpdate.find();
    }

    if (!roomUpdates) {
      return NextResponse.json(
        {
          message: "No room updates found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(roomUpdates);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to get the room updates",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const body = await req.json();

    const newRoomUpdate = new RoomUpdate(body);
    const savedRoomUpdate = await newRoomUpdate.save();

    if (!savedRoomUpdate) {
      return NextResponse.json(
        {
          message: "Can't able to save the room update",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(savedRoomUpdate);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to save the room update",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    const updatedRoomUpdate = await RoomUpdate.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedRoomUpdate) {
      return NextResponse.json(
        {
          message: "Can't able to update the room update",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedRoomUpdate);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to update the room update",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const deletedRoomUpdate = await RoomUpdate.findByIdAndDelete(id);

    if (!deletedRoomUpdate) {
      return NextResponse.json(
        {
          message: "Can't able to delete the room update",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(deletedRoomUpdate);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to delete the room update",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};
