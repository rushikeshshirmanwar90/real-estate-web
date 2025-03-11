import connect from "@/lib/db";
import { RoomInfo } from "@/lib/models/RoomInfo";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const flatId = searchParams.get("id");

    const res: any = await RoomInfo.find({
      flatId,
    });

    if (res > 0) {
      return NextResponse.json(
        {
          message: `Room information of this flat is available`,
        },
        { status: 200 }
      );
    }

    return null;
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      {
        message: "something went wrong, can't fetch the data",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
