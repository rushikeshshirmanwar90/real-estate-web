import connect from "@/lib/db";
import { LoginUser } from "@/lib/models/Xsite/LoginUsers";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await LoginUser.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid credentials", // Don't reveal if user exists or not
        },
        { status: 401 }
      );
    }

    // Check if user.password exists and is a string
    if (!user.password || typeof user.password !== "string") {
      console.error("User password is invalid:", typeof user.password);
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Verify password with proper error handling
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Bcrypt comparison error:", bcryptError);
      return NextResponse.json(
        {
          message: "Authentication error",
        },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        message: "User logged in successfully",
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        message: "An error occurred during login",
      },
      { status: 500 }
    );
  }
};
