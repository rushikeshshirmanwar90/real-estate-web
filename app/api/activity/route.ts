import connect from "@/lib/db";
import { Activity } from "@/lib/models/Xsite/Activity";
import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { NextRequest } from "next/server";

// GET: Fetch activities with filters
export const GET = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const clientId = searchParams.get("clientId");
  const userId = searchParams.get("userId");
  const activityType = searchParams.get("activityType");
  const category = searchParams.get("category");
  const action = searchParams.get("action");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const limit = Math.max(
    1,
    Math.min(1000, parseInt(searchParams.get("limit") || "50"))
  );
  const skip = Math.max(0, parseInt(searchParams.get("skip") || "0"));

  try {
    await connect();

    if (!clientId && !projectId) {
      return errorResponse("clientId or projectId is required", 400);
    }

    const query: Record<string, string | Record<string, string>> = {};

    if (clientId) query.clientId = clientId;
    if (projectId) query.projectId = projectId;
    if (userId) query["user.userId"] = userId;
    if (activityType) query.activityType = activityType;
    if (category) query.category = category;
    if (action) query.action = action;
    // date range filtering (ISO date strings). model stores `date` as string.
    if (dateFrom || dateTo) {
      query.date = {} as Record<string, string>;
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Activity.countDocuments(query);

    return successResponse(
      {
        activities,
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
      "Activities fetched successfully",
      200
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

// POST: Create activity log
export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const body = await req.json();

    // Validation
    if (!body.user || !body.user.userId || !body.user.fullName) {
      return errorResponse("User information is required", 400);
    }

    if (!body.clientId) {
      return errorResponse("clientId is required", 400);
    }

    if (!body.activityType) {
      return errorResponse("activityType is required", 400);
    }

    if (!body.category) {
      return errorResponse("category is required", 400);
    }

    if (!body.action) {
      return errorResponse("action is required", 400);
    }

    if (!body.description) {
      return errorResponse("description is required", 400);
    }

    // Ensure `date` exists and is a valid ISO string (model requires it)
    const dateStr = body.date ? String(body.date) : new Date().toISOString();
    if (Number.isNaN(Date.parse(dateStr))) {
      return errorResponse("date must be a valid ISO date string", 400);
    }

    const doc = { ...body, date: dateStr };

    const newActivity = new Activity(doc);
    await newActivity.save();

    return successResponse(newActivity, "Activity logged successfully", 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

// DELETE: Delete activities (admin only - optional)
export const DELETE = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const activityId = searchParams.get("id");

  try {
    await connect();

    if (!activityId) {
      return errorResponse("Activity ID is required", 400);
    }

    const deletedActivity = await Activity.findByIdAndDelete(activityId);

    if (!deletedActivity) {
      return errorResponse("Activity not found", 404);
    }

    return successResponse(
      deletedActivity,
      "Activity deleted successfully",
      200
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};
