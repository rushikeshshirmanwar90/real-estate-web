import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/lib/models/Users";
import { Client } from "@/lib/models/super-admin/Client";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { email, password, userType } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    let updatedPassword: string | null = "";

    if (userType === "client") {
      updatedPassword = await Client.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "user") {
      updatedPassword = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }

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
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "can't able update the password, please try again",
        error: error,
      },
      { status: 500 }
    );
  }
};
