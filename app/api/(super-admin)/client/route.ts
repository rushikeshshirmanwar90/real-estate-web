import connect from "@/lib/db";
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
          { message: "client data not found" },
          { status: 400 }
        );
      }
      return NextResponse.json({ clientData }, { status: 200 });
    }

    const clientData = await Client.findById(id);
    if (!clientData) {
      return NextResponse.json(
        { message: `client not found with ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ clientData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const data = await req.json();

    // Remove userType from the data entirely
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userType, ...cleanData } = data;

    const addClient = new Client(cleanData);
    await addClient.save();

    return NextResponse.json(
      {
        message: "Client added successfully",
        client: addClient,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error adding client:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An error occurred while adding client" },
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
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connect();
    const deletedClient = await Client.findOneAndDelete({ email });

    if (!deletedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Client Deleted Successfully",
        data: deletedClient,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Internal Server Error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 }
      );
    }

    await connect();
    const data = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...allowedData } = data;

    const clientData = await Client.findByIdAndUpdate(id, allowedData, {
      new: true,
      runValidators: true,
    });

    if (!clientData) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Client updated successfully",
        clientData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
