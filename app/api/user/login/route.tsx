import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
    try {
        await connect();
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                message: "Email and password are required"
            }, { status: 400 })  // Changed to 400 Bad Request
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json({
                message: "Invalid password"
            }, {
                status: 403
            })
        }

        // Success response - you might want to add more user data or a token here
        return NextResponse.json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                // Add any other user properties you want to return
            }
        }, { status: 200 })

    } catch (error: any) {
        // Error handling
        console.error("Login error:", error);

        return NextResponse.json({
            message: "An error occurred during login",
            error: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}