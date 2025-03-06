import { NextResponse } from "next/server";
import { User } from "@/lib/models/Users";
import { Client } from "@/lib/models/Client";
import connect from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    await connect();

    const body = await req.json();

    const clientId = body.clientId;
    const findClient = await Client.findById(clientId);

    if (!findClient) {
      return NextResponse.json(
        {
          message: "Invalid Client Id",
        },
        {
          status: 403,
        }
      );
    }

    const newUser = new User(body);

    newUser.save();

    if (!newUser) {
      return NextResponse.json(
        {
          message: "Unexpected error, can't able to register",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "user registered successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Error : " + error.message);
    return NextResponse.json(
      {
        message: "Error can't able to register",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
