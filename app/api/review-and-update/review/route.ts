// app/api/review-and-updates/route.ts
import connect from "@/lib/db";
import { ReviewAndUpdates } from "@/lib/models/ReviewAndUpdates";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const updateId = searchParams.get("updateId");

  try {
    const data = await req.json();
    await connect();

    const updatedItem = await ReviewAndUpdates.findOneAndUpdate(
      { "updates._id": updateId },
      {
        $push: {
          "updates.$.reviews": {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            review: data.review,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        {
          message: "update not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        updatedItem,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("something went wrong : ", error);
    return NextResponse.json(
      {
        message: "Something went wrong!",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};
