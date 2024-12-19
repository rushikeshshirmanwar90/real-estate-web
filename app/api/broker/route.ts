import bcrypt from "bcrypt";
import connect from "@/lib/db";
import { Broker } from "@/lib/models/Brokers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (id) {
      const broker = await Broker.findById(id);
      if (!broker) {
        return NextResponse.json(
          {
            message: "broker not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(broker);
    }

    const brokers = await Broker.find();

    if (!brokers) {
      return NextResponse.json(
        {
          message: "no brokers found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(brokers);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "error fetching brokers",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const SALT_ID = process.env.SALT_ID!;

    await connect();

    if (body.password) {
      body.password = await bcrypt.hash(body.password, SALT_ID);
    }

    const broker = new Broker(body);
    await broker.save();

    if (!broker) {
      return NextResponse.json(
        {
          message: "broker not created",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "broker created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to add the broker",
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

    const { email, phoneNumber, password, ...allowFields } = body;

    await connect();

    const updatedBroker = await Broker.findByIdAndUpdate(id, allowFields, {
      new: true,
    });

    if (!updatedBroker) {
      return NextResponse.json(
        {
          message: "broker not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "brokers data updated successfully",
      updatedData: updatedBroker,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to update the brokers details",
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

    const deletedBroker = await Broker.findByIdAndDelete(id);

    if (!deletedBroker) {
      return NextResponse.json(
        {
          message: "broker not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "broker deleted successfully",
        deletedData: deletedBroker,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to delete the broker",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
