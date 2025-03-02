import connect from "@/lib/db";
import { FlatInfo } from "@/lib/models/FlatInfo";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const flatId = searchParams.get("flatId");

    let flatInfo;

    if (flatId) {
      flatInfo = await FlatInfo.findById(flatId);
    } else {
      flatInfo = await FlatInfo.find();
    }

    if (!flatInfo) {
      return NextResponse.json(
        {
          message: "No flat info found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(flatInfo);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to get the flat info",
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

    const newFlatInfo = new FlatInfo(body);
    const savedFlatInfo = await newFlatInfo.save();

    if (!savedFlatInfo) {
      return NextResponse.json(
        {
          message: "Can't able to save the flat info",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(savedFlatInfo);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to save the flat info",
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

    const body = await req.json();

    const flatInfo = await FlatInfo.findByIdAndUpdate(body._id, body, {
      new: true,
    });

    if (!flatInfo) {
      return NextResponse.json(
        {
          message: "Can't able to update the flat info",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(flatInfo);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to update the flat info",
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

    const body = await req.json();

    const flatInfo = await FlatInfo.findByIdAndDelete(body._id);

    if (!flatInfo) {
      return NextResponse.json(
        {
          message: "Can't able to delete the flat info",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(flatInfo);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to delete the flat info",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};
