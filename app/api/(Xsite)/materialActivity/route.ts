import connect from "@/lib/db";
import { MaterialActivity } from "@/lib/models/Xsite/materials-activity";
import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { NextRequest } from "next/server";

interface MaterialItem {
  name: string;
  unit: string;
  specs?: Record<string, unknown>;
  qnt: number;
  cost?: number;
  addedAt?: Date;
}

interface UserPayload {
  userId: string;
  fullName: string;
}

interface ImportedMaterialPayload {
  clientId: string;
  projectId: string;
  materials: MaterialItem[];
  message?: string;
}

// GET: Fetch imported materials by projectId or clientId
export const GET = async (req: NextRequest | Request) => {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const clientId = searchParams.get("clientId");
  const userId = searchParams.get("userId");
  const activity = searchParams.get("activity");

  try {
    await connect();

    if (!projectId && !clientId) {
      return errorResponse("projectId or clientId is required", 406);
    }

    const query: Record<string, string> = {};
    if (projectId) query.projectId = projectId;
    if (clientId) query.clientId = clientId;
    if (activity) query.activity = activity;
    if (userId) query["user.userId"] = userId;

    const getMaterials = await MaterialActivity.find(query).sort({
      createdAt: -1,
    });

    if (!getMaterials || getMaterials.length === 0) {
      return successResponse([], "No imported materials found", 200);
    }

    return successResponse(getMaterials, "Data fetched successfully", 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

// POST: Create imported material request
export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const {
      materials,
      message,
      clientId,
      projectId: reqProjectId,
      activity,
      user,
    } = (await req.json()) as {
      clientId: string;
      projectId: string;
      materials: MaterialItem[];
      message?: string;
      activity: "imported" | "used";
      user: UserPayload;
    };

    // Validation
    if (!clientId) {
      return errorResponse("clientId is required", 406);
    }

    if (!reqProjectId) {
      return errorResponse("projectId is required", 406);
    }

    if (!activity || (activity !== "imported" && activity !== "used")) {
      return errorResponse(
        "activity is required and must be 'imported' or 'used'",
        406
      );
    }

    if (!Array.isArray(materials) || materials.length === 0) {
      return errorResponse("Materials array cannot be empty", 406);
    }

    // Validate each material item
    for (const material of materials) {
      if (
        !material.name ||
        !material.unit ||
        typeof material.qnt !== "number"
      ) {
        return errorResponse(
          "Each material must have name, unit, and qnt (number)",
          406
        );
      }

      if (material.qnt <= 0) {
        return errorResponse("Material quantity must be greater than 0", 406);
      }

      if (material.cost && material.cost < 0) {
        return errorResponse("Material cost cannot be negative", 406);
      }
    }

    // validate user
    if (!user || typeof user !== "object") {
      return errorResponse("user is required", 406);
    }
    if (!user.userId || !user.fullName) {
      return errorResponse("user.userId and user.fullName are required", 406);
    }

    const payload: ImportedMaterialPayload & {
      activity: "imported" | "used";
      user: UserPayload;
    } = {
      clientId,
      projectId: reqProjectId,
      materials: materials.map((material) => ({
        ...material,
        specs: material.specs || {},
        cost: material.cost || 0,
        addedAt: material.addedAt ? new Date(material.addedAt) : new Date(),
      })),
      message: message || "",
      activity,
      user,
    };

    const newImportedMaterial = new MaterialActivity(payload);
    await newImportedMaterial.save();

    return successResponse(
      newImportedMaterial,
      "Material imported successfully",
      201
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const projectId = searchParams.get("projectId");
    const clientId = searchParams.get("clientId");

    if (!id) {
      return errorResponse(
        "Requested material id is required for deletion",
        406
      );
    }

    // Handle delete all entries
    if (id === "all") {
      // Build query based on provided parameters
      const query: Record<string, string> = {};

      if (projectId) {
        query.projectId = projectId;
      }

      if (clientId) {
        query.clientId = clientId;
      }

      // If neither projectId nor clientId is provided, delete ALL entries
      // (use with caution!)
      const deletedCount = await MaterialActivity.deleteMany(query);

      if (deletedCount.deletedCount === 0) {
        return successResponse(
          { deletedCount: 0 },
          "No material activities found to delete",
          200
        );
      }

      return successResponse(
        { deletedCount: deletedCount.deletedCount, query },
        `Successfully deleted ${deletedCount.deletedCount} material activities`,
        200
      );
    }

    // Delete single MaterialActivity by id
    const deletedRequest = await MaterialActivity.findByIdAndDelete(id);

    if (!deletedRequest) {
      return errorResponse("Requested material not found", 404);
    }

    return successResponse(
      deletedRequest,
      "Requested material deleted successfully",
      200
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse("Something went wrong", 500, error.message);
    }
    return errorResponse("Unknown error occurred", 500);
  }
};
