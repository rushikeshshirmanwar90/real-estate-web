import connect from "@/lib/db";
import jwt from "jsonwebtoken";
import { User } from "@/lib/models/Users";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, password, phoneNumber } = await req.json();
    const cookieStore = await cookies();

    const JWT_SECRET = process.env.JWT_SECRET!;
    const COOKIE_NAME = "user_auth_token";

    await connect();

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid emailId or phone number",
        },
        {
          status: 404,
        }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid Password..!!",
        },
        {
          status: 401,
        }
      );
    }

    const userId = user._id;

    const payload = { email, userId };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1000d" });

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 1000,
    });

    return NextResponse.json(
      {
        message: "user login successfully..!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "can't able to login",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
