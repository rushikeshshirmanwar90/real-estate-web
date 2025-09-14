import connect from "@/lib/db";
import { Client } from "@/lib/models/super-admin/Client";
import { User } from "@/lib/models/Users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const body = await req.json();
    const { email, userType } = body;

    if (!userType) {
      return NextResponse.json(
        {
          message: "userType is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (userType == "user") {
      const isUser = await User.findOne({ email });

      if (!isUser) {
        return NextResponse.json(
          {
            message: "User not registered",
          },
          {
            status: 404,
          }
        );
      }

      if (
        isUser.password == "" ||
        isUser.password == null ||
        isUser.password == undefined
      ) {
        return NextResponse.json(
          {
            isUser,
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        {
          isUser,
        },
        { status: 200 }
      );
    } else if (userType == "client") {
      const isUser = await Client.findOne({ email });

      if (!isUser) {
        return NextResponse.json(
          {
            message: "Client not registered",
          },
          {
            status: 404,
          }
        );
      }

      if (
        isUser.password == "" ||
        isUser.password == null ||
        isUser.password == undefined
      ) {
        return NextResponse.json(
          {
            isUser,
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        {
          isUser,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Can't able to find the user, something went wrong, please try again",
        error: error,
      },
      { status: 500 }
    );
  }
};
