import connect from "@/lib/db";
import { LoginUser } from "@/lib/models/Xsite/LoginUsers";
import { Client } from "@/lib/models/super-admin/Client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connect();
    if (!id) {
      const clientData = await Client.find();

      if (clientData.length < 0 || !clientData) {
        return NextResponse.json(
          {
            message: "client data not found",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ clientData }, { status: 200 });
    }

    const clientData = await Client.findById(id);

    if (!clientData) {
      return NextResponse.json({ message: `client not found with ${id}` });
    }

    // Add the missing return statement here
    return NextResponse.json({ clientData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const data = await req.json();

    const addClient = new Client(data);
    await addClient.save();

    const { email, ...otherData } = data;

    console.log(otherData);
    const payload = { email, userType: "client" };
    const newEntry = new LoginUser(payload);
    await newEntry.save();

    return NextResponse.json({ message: "Client added successfully" });
  } catch (error: unknown) {
    console.error("Error: " + error);
    return NextResponse.json(
      { message: "An error occurred", error: error },
      { status: 500 }
    );
  }
};
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 402 }
      );
    }

    await connect();

    const deletedClient = await Client.findOneAndDelete({ email });
    const deletedLoginUser = await LoginUser.findOneAndDelete({ email });

    if (!deletedClient || !deletedLoginUser) {
      return NextResponse.json(
        { message: "Something went wrong can't Delete Client" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Client Deleted Successfully",
      data: deletedClient,
    });
  } catch (error: unknown) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...allowedData } = data;

  try {
    await connect();
    const clientData = await Client.findByIdAndUpdate(id, allowedData);

    if (!clientData) {
      return NextResponse.json(
        {
          message: "client not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ clientData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
