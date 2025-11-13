import connect from "@/lib/db";
import { ImportedMaterials } from "@/lib/models/Xsite/imported-materials";
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

  try {
    await connect();

    if (!projectId && !clientId) {
      return errorResponse("projectId or clientId is required", 406);
    }

    const query: Record<string, string> = {};
    if (projectId) query.projectId = projectId;
    if (clientId) query.clientId = clientId;

    const getMaterials = await ImportedMaterials.find(query);

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
    } = (await req.json()) as {
      clientId: string;
      projectId: string;
      materials: MaterialItem[];
      message?: string;
    };

    // Validation
    if (!clientId) {
      return errorResponse("clientId is required", 406);
    }

    if (!reqProjectId) {
      return errorResponse("projectId is required", 406);
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

    const payload: ImportedMaterialPayload = {
      clientId,
      projectId: reqProjectId,
      materials: materials.map((material) => ({
        ...material,
        specs: material.specs || {},
        cost: material.cost || 0,
        addedAt: new Date(),
      })),
      message: message || "",
    };

    const newImportedMaterial = new ImportedMaterials(payload);
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

    if (!id) {
      return errorResponse(
        "Requested material id is required for deletion",
        406
      );
    }

    const deletedRequest = await ImportedMaterials.findByIdAndDelete(id);

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
