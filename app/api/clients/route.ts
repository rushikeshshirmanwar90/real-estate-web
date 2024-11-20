import bcrypt from "bcrypt";
import connect from "@/lib/db";
import { Client } from "@/lib/models/Client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();

    const clientData = await Client.find();

    return NextResponse.json(clientData);
  } catch (error: any) {
    console.error("Error : " + error.message);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const data = await req.json();
    const saltRounds = parseInt(process.env.SALT_ID!, 10);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    const addClient = new Client(data);
    await addClient.save();

    return NextResponse.json({ message: "Client added successfully" });
  } catch (error: any) {
    console.error("Error: " + error.message);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 402 }
      );
    }

    await connect();

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return NextResponse.json(
        { message: "Something went wrong can't Delete Client" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Client Deleted Successfully",
      data: deletedClient,
    });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Id Not Found" },
        {
          status: 404,
        }
      );
    }

    const { name, city, address, area } = await req.json();

    const updatedUser = await Client.findByIdAndUpdate(
      id,
      {
        name,
        city,
        address,
        area,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Something went wrong can't update user",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};
