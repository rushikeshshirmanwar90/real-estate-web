import connect from "@/lib/db";
import { Flats } from "@/lib/models/Flats";
import { NextResponse } from "next/server";

export const GET = async (req: Response) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      const flats = await Flats.find();

      if (!flats) {
        return NextResponse.json(
          {
            message: "can't able fetch data",
          },
          {
            status: 401,
          }
        );
      }

      return NextResponse.json(flats);
    } else {
      const flat = await Flats.findById(id);
      if (!flat) {
        return NextResponse.json(
          {
            message: "can't able to fetch the data",
          },
          {
            status: 401,
          }
        );
      }

      return NextResponse.json(flat);
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to fetch the data",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: Response) => {
  try {
    await connect();

    const body = await req.json();

    const newFlats = new Flats(body);
    await newFlats.save();

    if (!newFlats) {
      return NextResponse.json(
        {
          message: "can't able to add flats",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to add the flats",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: Response) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    const deletedFlat = await Flats.findByIdAndDelete(id);

    if (!deletedFlat) {
      return NextResponse.json(
        {
          message: "invalid flat id",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message: "successfully deleted flat",
        deletedData: deletedFlat,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to delete the flat",
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req: Response) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    const body = await req.json();

    const updatedFlat = await Flats.findByIdAndUpdate(id, body, { new: true });

    if (!updatedFlat) {
      return NextResponse.json(
        {
          message: "Can't able to find the flat",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Flat updated Successfully..!",
        updatedData: updatedFlat,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to update the flat",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
