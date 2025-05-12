import { Lead } from "@/lib/models/Leads";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { message: "clientId and interestedType are required" },
      {
        status: 400,
      }
    );
  }

  try {
    const leads = await Lead.find({
      clientId,
    });

    if (leads.length === 0) {
      return NextResponse.json(
        {
          message: "No Lead Found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        leads,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "can't fetch leads",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
};

export const POST = async (req: NextRequest | Request) => {
  const body = await req.json();

  const {
    clientId,
    name,
    phone,
    projectDetails,
    interestedType,
    propertyDetails,
  } = body;

  if (!clientId || !name || !phone || !projectDetails || !interestedType) {
    return NextResponse.json(
      { message: "All fields are required" },
      {
        status: 400,
      }
    );
  }

  try {
    const lead = await Lead.create({
      clientId,
      name,
      phone,
      projectDetails,
      interestedType,
      propertyDetails,
    });

    return NextResponse.json(
      {
        message: "Lead created successfully",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "can't able to add lead",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) {
    return NextResponse.json(
      { message: "leadId is required" },
      {
        status: 400,
      }
    );
  }

  try {
    const lead = await Lead.findByIdAndDelete(leadId);

    if (!lead) {
      return NextResponse.json(
        {
          message: "Lead not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Lead deleted successfully",
        lead,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "can't able to delete lead",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
};

export const PUT = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const leadIdParams = searchParams.get("leadId");
  const body = await req.json();
  const { leadId, ...restData } = body;

  console.log(leadId);

  if (!leadIdParams) {
    return NextResponse.json(
      { message: "leadId is required" },
      {
        status: 400,
      }
    );
  }

  if (!restData) {
    return NextResponse.json(
      { message: "body is required" },
      {
        status: 400,
      }
    );
  }

  try {
    const lead = await Lead.findByIdAndUpdate(leadIdParams, restData, {
      new: true,
    });

    if (!lead) {
      return NextResponse.json(
        {
          message: "Lead not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Lead updated successfully",
        data: lead,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "can't able to update lead",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
};
