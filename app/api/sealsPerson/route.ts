import connect from "@/lib/db";
import bcrypt from "bcrypt";
import { sealsPerson } from "@/lib/models/SealsPerson";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (id) {
      const user = await sealsPerson.findById(id);
      if (!user) {
        return NextResponse.json(
          {
            message: "user not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(user, { status: 200 });
    }

    const users = await sealsPerson.find();
    if (!users) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to get the seals persons",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const SALT_ID = process.env.SALT_ID!;
    await connect();
    const body = await req.json();

    if (body.password) {
      body.password = await bcrypt.hash(body.password, SALT_ID);
    }

    const user = await new sealsPerson(body);
    await user.save();

    if (!user) {
      return NextResponse.json(
        { message: "can't able to create the user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "user created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to add user",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    const deletedUser = await sealsPerson.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        {
          message: "user not find",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to delete user",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    const { phoneNumber, email, password, ...allowUpdateFields } = body;
    await connect();

    const updatedUser = await sealsPerson.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "can't able update the user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "user updated successfully",
        updatedData: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "can't able to update user" },
      { status: 500 }
    );
  }
};
