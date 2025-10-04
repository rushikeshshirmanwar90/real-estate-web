import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Customer } from "@/lib/models/Customer";
import { Client } from "@/lib/models/super-admin/Client";
import { LoginUser } from "@/lib/models/Xsite/LoginUsers";
import { Staff } from "@/lib/models/Staff";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { email, userType } = await req.json();

    let updatedPassword: string | null = "";

    if (userType === "client") {
      updatedPassword = await Client.findOneAndUpdate(
        { email },
        { password: "" },
        { new: true }
      );

      await LoginUser.findOneAndUpdate({ email }, { password: "" });
    } else if (userType === "user") {
      updatedPassword = await Customer.findOneAndUpdate(
        { email },
        { password: "" },
        { new: true }
      );
      await LoginUser.findOneAndUpdate({ email }, { password: "" });
    } else if (userType === "staff") {
      updatedPassword = await Staff.findOneAndUpdate(
        { email },
        { password: "" },
        { new: true }
      );
      await LoginUser.findOneAndUpdate({ email }, { password: "" });
    }

    if (!updatedPassword) {
      return NextResponse.json(
        {
          message: "something went wrong please try again",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "now you can update the password",
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
