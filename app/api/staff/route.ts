import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();

    const staffData = await User.find({
      userType: "staff",
    });

    if (!staffData) {
      return NextResponse.json(
        {
          message: "staff not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        staffData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "can't able to fetch staff data",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};
