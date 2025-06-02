import { Lead } from "@/lib/models/Leads";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";

// GET all Leads records or a specific one by ID
export const GET = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        {
          message: "Client ID is required",
        },
        { status: 400 }
      );
    }

    await connect();

    if (id) {
      const leads = await Lead.findById(id);
      if (!leads) {
        return NextResponse.json(
          {
            message: "no leads are found with this ID",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(leads);
    }

    const allLeads = await Lead.find({ clientId });
    if (!allLeads || allLeads.length === 0) {
      return NextResponse.json(
        {
          message: "no Leads records found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(allLeads);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error fetching Leads records",
        error: error,
      },
      { status: 500 }
    );
  }
};

// POST a new Lead record
export const POST = async (req: NextRequest | Request) => {
  try {
    const body = await req.json();
    await connect();

    const newLead = new Lead(body);
    await newLead.save();

    if (!newLead) {
      return NextResponse.json(
        {
          message: "new Lead record not created",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Lead record created successfully", newLead },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "can't add the Lead record",
        error: error,
      },
      { status: 500 }
    );
  }
};

// PUT/UPDATE an Lead record
export const PUT = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "ID is required for updating an Lead record",
        },
        { status: 400 }
      );
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        {
          message: "Lead record not found or not updated",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Lead record updated successfully",
        interested: updatedLead,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error updating interested record",
        error: error,
      },
      { status: 500 }
    );
  }
};

// DELETE an Lead record
export const DELETE = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "ID is required for deleting an Lead record",
        },
        { status: 400 }
      );
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        {
          message: "Lead record not found or not deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Lead record deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error deleting Lead record",
        error: error,
      },
      { status: 500 }
    );
  }
};
