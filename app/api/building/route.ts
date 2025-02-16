import { Building } from "@/lib/models/Building";
import connect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Response) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const id = searchParams.get("id");

    if (!id) {
      const buildings = await Building.find();

      if (!buildings) {
        return NextResponse.json(
          {
            message: "No buildings found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(buildings);
    }
    const building = await Building.findById(id);

    if (!building) {
      return NextResponse.json(
        {
          message: "Invalid Building id",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(building);

  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to get the buildings",
        error: error.message,
      },
      {
        status: 200,
      }
    );
  }
};

export const POST = async (req: Response) => {
  try {
    await connect();

    const body = await req.json();

    const newUser = await new Building(body);
    newUser.save();

    if (!newUser) {
      return NextResponse.json(
        {
          message: "can't able to add new building",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message: "building added successfully",
        data: newUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "something wen't wrong, can't able to create the building",
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

    const deletedBuilding = await Building.findByIdAndDelete(id);

    if (!deletedBuilding) {
      return NextResponse.json(
        {
          message: "invalid building",
        },
        {
          status: 402,
        }
      );
    }

    return NextResponse.json(
      {
        message: "building deleted successfully",
        data: deletedBuilding,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to delete the building",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Response) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    await connect();

    const updateBuilding = await Building.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updateBuilding) {
      return NextResponse.json(
        {
          message: "invalid building id",
        },
        {
          status: 402,
        }
      );
    }

    return NextResponse.json(
      {
        message: "building has been updated successfully",
        updatedData: updateBuilding,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "can't able to update the building",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
