import { Projects } from "@/lib/models/Project";
import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateClient } from "@/components/functions/validateClient";
import { ObjectId } from "mongodb";

export const GET = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();
    if (id) {
      const project = await Projects.findById(id);
      if (!project) {
        return new Response("Project not found", { status: 404 });
      }
      return NextResponse.json(project);
    }

    const projects = await Projects.find();

    if (!projects) {
      return NextResponse.json(
        {
          message: "can't able to fetch the data",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(projects, {
      status: 200,
    });
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        message: "can't able to get the Projects",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const isValidClient = await validateClient();

    if (isValidClient) {
      const body = await req.json();

      // Ensure clientId is converted to ObjectId before saving
      const formattedBody = {
        ...body,
        clientId: new ObjectId(body.clientId),
      };

      const newProject = await new Projects(formattedBody);
      await newProject.save();

      if (!newProject) {
        return NextResponse.json(
          {
            message: "Unable to add the project",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          message: "Project created successfully",
          project: newProject,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Client not found",
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unable to create the Project",
        error: error,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const projectId = searchParams.get("id");

    const deletedProject = await Projects.findByIdAndDelete(projectId);
    // const deletedProject = await Projects.deleteMany();

    if (!deletedProject) {
      return NextResponse.json(
        {
          message: "can't able to delete the project",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      message: "project deleted successfully",
      project: deletedProject,
    });
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        message: "can't able to delete the project",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    const body = await req.json();

    const updatedProject = await Projects.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedProject) {
      return NextResponse.json(
        {
          message: "can't able to update the project something went wrong",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Project updated successfully",
        data: updatedProject,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: "can't able to update the project",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};
