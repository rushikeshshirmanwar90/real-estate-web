import connect from "@/lib/db";
import { Contacts } from "@/lib/models/Contacts";
import { Customer } from "@/lib/models/users/Customer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest | Request) => {
  try {
    // Establish database connection (if required)
    await connect();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const userId = searchParams.get("userId");
    const isAll = searchParams.get("all") === "yes"; // Strict comparison, defaults to false

    let res;

    // Handle queries with clear precedence
    if (isAll) {
      res = await Contacts.find();
    } else if (clientId) {
      res = await Contacts.find({ clientId });
    } else if (userId) {
      res = await Contacts.find({ userId });
    } else {
      return NextResponse.json(
        {
          message: "No valid query parameters provided",
          data: [],
        },
        { status: 400 }
      );
    }

    if ((clientId || userId) && !res) {
      return NextResponse.json(
        {
          message: `Contact not found for ${clientId ? "clientId" : "userId"}`,
          data: null,
        },
        { status: 404 }
      );
    }

    // Standardize response format (always return an array)
    const data = Array.isArray(res) ? res : res ? [res] : [];

    return NextResponse.json(
      {
        message: "Contacts retrieved successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Unable to retrieve contacts",
        error: error,
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid input: body must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate each contact object
    const validContacts = body.filter((contact) => {
      // Check required fields according to your schema
      if (!contact.clientId || !contact.userId) {
        console.log("Skipping contact missing required fields:", contact);
        return false;
      }

      // Ensure at least first name or phone number exists
      if (!contact.firstName && !contact.phoneNumber) {
        console.log(
          "Skipping contact with no identifying information:",
          contact
        );
        return false;
      }

      return true;
    });

    if (validContacts.length === 0) {
      return NextResponse.json(
        {
          message: "No valid contacts to insert",
        },
        { status: 400 }
      );
    }

    // Get the user's verification status
    const user = await Customer.findOne({ _id: validContacts[0].userId });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.verified) {
      return NextResponse.json(
        {
          message: "User is already verified",
        },
        { status: 400 }
      );
    }

    // Insert the contacts
    const insertContact = await Contacts.insertMany(validContacts);

    // Check if any documents were inserted
    if (insertContact.length === 0) {
      return NextResponse.json(
        {
          message: "Unable to insert the contacts, please try again",
        },
        { status: 500 }
      );
    }

    // Update user's verification status
    await Customer.findByIdAndUpdate(
      user._id,
      { verified: true },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Data inserted successfully and user verified",
        insertedCount: insertContact.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Unable to insert the contacts",
        error: error,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    // Establish database connection
    await connect();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const userId = searchParams.get("userId");

    // Validate that at least one parameter is provided
    if (!clientId && !userId) {
      return NextResponse.json(
        {
          message: "At least one of clientId or userId is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const query: { clientId?: string; userId?: string } = {};
    if (clientId) query.clientId = clientId;
    if (userId) query.userId = userId;

    // Attempt to delete the contact
    const deleteResult = await Contacts.deleteOne(query);

    // Check if a document was deleted
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          message: `No contact found to delete for ${
            clientId ? "clientId" : "userId"
          }`,
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Contact deleted successfully",
        data: { deletedCount: deleteResult.deletedCount },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Unable to delete contact",
        error: error,
      },
      { status: 500 }
    );
  }
};
