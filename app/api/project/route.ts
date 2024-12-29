import { Projects } from "@/lib/models/Project";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { validateClient } from "@/components/utils/validateClient";

export const GET = async (req: Request) => {
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

    const projects = await Projects.find().sort({ createdAt: -1 });

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
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      {
        message: "can't able to get the Projects",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    await connect();
    const isValidClient = await validateClient();
    if (isValidClient) {
      const body = await req.json();

      const newProject = await new Projects(body);
      newProject.save();

      if (!newProject) {
        return NextResponse.json(
          {
            message: "can't able to add the project",
          },
          {
            status: 400,
          }
        );
      }
      return NextResponse.json(
        {
          message: "Project created successfully",
          project: newProject,
        },
        {
          status: 201,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "client not found",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to create the Project",
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
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      {
        message: "can't able to delete the project",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req: Request) => {
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
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "can't able to update the project",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
