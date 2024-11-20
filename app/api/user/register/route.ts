import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt  from "jsonwebtoken";
import { User } from "@/lib/models/Users";
import { Client } from "@/lib/models/Client";
import connect from "@/lib/db";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  const SALT_ID = parseInt(process.env.SALT_ID!, 10);
  try {
    const cookieStore = await cookies();

    const JWT_SECRET = process.env.JWT_SECRET!;
    const COOKIE_NAME = "user_auth_token";

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

    if (body.password) {
      body.password = await bcrypt.hash(body.password, SALT_ID);
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

    const userId = newUser._id;
    const email = body.email;

    const payload = { email, userId };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1000d" });

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 1000,
    });

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