import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/lib/models/Users";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedPassword = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedPassword) {
      return NextResponse.json(
        {
          message: "can't able to update the user, please try again",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "updated updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "can't able update the password, please try again",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
