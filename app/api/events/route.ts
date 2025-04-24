import connect from "@/lib/db";
import { Event } from "@/lib/models/Events";
import { NextRequest, NextResponse } from "next/server";

// GET all events or a specific one by ID
export const GET = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connect();

    if (id) {
      const event = await Event.findById(id);
      if (!event) {
        return NextResponse.json(
          {
            message: "Event not found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(event);
    }

    const allEvents = await Event.find();
    if (!allEvents || allEvents.length === 0) {
      return NextResponse.json(
        {
          message: "No events found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(allEvents);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error fetching events",
        error: error,
      },
      { status: 500 }
    );
  }
};

// POST a new event
export const POST = async (req: NextRequest | Request) => {
  try {
    const body = await req.json();
    await connect();
    const event = new Event(body);
    await event.save();

    if (!event) {
      return NextResponse.json(
        {
          message: "Event not created",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Can't add the event",
        error: error,
      },
      { status: 500 }
    );
  }
};

// PUT (update) an existing event
export const PUT = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "Event ID is required",
        },
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, body, { new: true });

    if (!updatedEvent) {
      return NextResponse.json(
        {
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error updating event",
        error: error,
      },
      { status: 500 }
    );
  }
};

// DELETE an event
export const DELETE = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connect();

    if (!id) {
      return NextResponse.json(
        {
          message: "Event ID is required",
        },
        { status: 400 }
      );
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        {
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error deleting event",
        error: error,
      },
      { status: 500 }
    );
  }
};
