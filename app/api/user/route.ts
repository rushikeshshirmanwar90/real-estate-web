import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/lib/models/Users";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json(
          {
            message: "user not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(user);
    }

    const allUsers = await User.find();

    return NextResponse.json(allUsers, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error can't Find the Users : " + error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async () => {
  try {
    await connect();
  } catch (error: any) {
    return NextResponse.json({
      message: "Error can't update the user data : " + error.message,
    });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connect();

    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    return NextResponse.json(
      {
        message: "user deleted successfully",
        user: deleteUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: "Error can't delete the user : " + error.message,
    });
  }
};
