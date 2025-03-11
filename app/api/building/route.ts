import { Building } from "@/lib/models/Building";
import { Projects } from "@/lib/models/Project";
import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

    const newBuilding = new Building(body);
    const savedBuilding = await newBuilding.save();

    if (!savedBuilding) {
      return NextResponse.json(
        { message: "Unable to add new building" },
        { status: 400 }
      );
    }

    const updatedProject = await Projects.findByIdAndUpdate(
      savedBuilding.projectId,
      {
        $push: {
          section: {
            sectionId: savedBuilding._id,
            name: savedBuilding.name,
            type: "Buildings",
          },
        },
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Building added successfully",
        data: savedBuilding,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding building:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating the building",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Response) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const sectionId = searchParams.get("sectionId");

    if (!projectId || !sectionId) {
      return NextResponse.json(
        { error: "Project ID and Section ID are required" },
        { status: 400 }
      );
    }

    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      {
        $pull: { section: { sectionId: sectionId } },
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const deletedBuilding = await Building.findByIdAndDelete(sectionId);

    if (!deletedBuilding) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Section and building deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting section and building:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

export const PATCH = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Building ID is required",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedBuilding = await Building.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBuilding) {
      return NextResponse.json(
        {
          message: "Building not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Building partially updated successfully",
        data: updatedBuilding,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating building:", error);
    return NextResponse.json(
      {
        message: "Failed to update building",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
