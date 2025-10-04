import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Customer } from "@/lib/models/users/Customer";
import { Client } from "@/lib/models/super-admin/Client";
import { LoginUser } from "@/lib/models/Xsite/LoginUsers";
import { Staff } from "@/lib/models/users/Staff";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { email, password, userType } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    let updatedPassword: string | null = "";

    if (userType === "clients") {
      updatedPassword = await Client.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );

      await LoginUser.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "user") {
      updatedPassword = await Customer.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );

      await LoginUser.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "staff") {
      console.log("i am here in staff");

      updatedPassword = await Staff.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );

      await LoginUser.findOneAndUpdate(
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
