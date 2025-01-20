import connect from "@/lib/db";
import { RowHouse } from "@/lib/models/RowHouse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    await connect();
    let data;

    if (id) {
      data = await RowHouse.findById(id);
    } else {
      data = await RowHouse.find();
    }

    if (!data) {
      return NextResponse.json(
        {
          message: "can't able to find RowHouse",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    await connect();

    const newData = await new RowHouse(data);

    if (!newData) {
      return NextResponse.json(
        {
          message: "can't able to add new RowHouse",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ newData }, { status: 200 });
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const rowHouseId = searchParams.get("rh");

  try {
    await connect();

    const deletedRowHouse = RowHouse.findByIdAndDelete(rowHouseId);
    if (!deletedRowHouse) {
      return NextResponse.json(
        { message: "can't able to delete the row house" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        deletedRowHouse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const rowHouseId = searchParams.get("rh");
  const newData = await req.json();

  try {
    await connect();

    const newHouse = await RowHouse.findByIdAndUpdate(
      rowHouseId,
      { newData },
      { new: true }
    );

    if (!newHouse) {
      return NextResponse.json(
        {
          message: "can't able to update the row house",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        newHouse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
