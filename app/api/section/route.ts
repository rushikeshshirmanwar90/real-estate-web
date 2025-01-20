import connect from "@/lib/db";
import { Section } from "@/lib/models/Section";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connect();

    let data;

    if (!id) data = await Section.find();
    else data = await Section.findById(id);

    if (!data) {
      return NextResponse.json(
        {
          message: "section not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    await connect();
    const newSection = await new Section(data);

    if (!newSection) {
      return NextResponse.json(
        {
          message: "can't able to add data !",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        newSection,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  try {
    await connect();

    const deletedSection = await Section.findByIdAndUpdate(sectionId, {
      new: true,
    });

    if (!deletedSection) {
      return NextResponse.json(
        {
          message: "invalid section id",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "section deleted Successfully !",
      deletedData: deletedSection,
    });
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  try {
    await connect();

    const newData = await req.json();

    const updatedData = await Section.findByIdAndUpdate(sectionId, newData, {
      new: true,
    });

    if (!updatedData) {
      return NextResponse.json(
        {
          message: "can't able to update the section !",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        updatedData,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("something went wrong : ", error.message);
    return NextResponse.json(
      {
        message: "Something wen't wrong !",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
