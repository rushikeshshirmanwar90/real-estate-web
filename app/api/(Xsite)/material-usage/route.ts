import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { Projects } from "@/lib/models/Project";
import { ObjectId } from "mongodb";

// Local types matching MaterialSchema
type Specs = Record<string, unknown>;

type MaterialSubdoc = {
  _id?: Types.ObjectId | string;
  name: string;
  unit: string;
  specs?: Specs;
  qnt: number;
  cost?: number;
  sectionId?: string;
  miniSectionId?: string;
};

// GET: Fetch MaterialAvailable for a project
export const GET = async (req: NextRequest | Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const clientId = searchParams.get("clientId");
    const sectionId = searchParams.get("sectionId");

    if (!projectId || !clientId) {
      return NextResponse.json(
        {
          message: "Project ID and Client ID are required",
        },
        {
          status: 400,
        }
      );
    }

    await connect();

    const project = await Projects.findOne(
      {
        _id: new ObjectId(projectId),
        clientId: new ObjectId(clientId),
      },
      { MaterialUsed: 1, MaterialAvailable: 1 }
    );

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    // If sectionId is provided, filter MaterialAvailable to that section
    const allAvailable = project.MaterialAvailable || [];
    // If sectionId provided, include entries that either belong to that section OR are global (no sectionId)
    const filteredAvailable = sectionId
      ? allAvailable.filter(
          (m: MaterialSubdoc) =>
            !m.sectionId || String(m.sectionId) === String(sectionId)
        )
      : allAvailable;

    return NextResponse.json(
      {
        success: true,
        message: "Material available fetched successfully",
        MaterialAvailable: filteredAvailable,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch MaterialAvailable",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();

    const { projectId, materialId, qnt, miniSectionId, sectionId } = body;

    // Validation
    if (!projectId || !materialId || typeof qnt !== "number" || !sectionId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "projectId, materialId, sectionId and numeric qnt are required",
        },
        { status: 400 }
      );
    }

    if (qnt <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Find project document first to get material details
    const project = await Projects.findById(projectId);
    if (!project) {
      console.error("Project not found for ID:", projectId);
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // Find material in MaterialAvailable by _id and sectionId (scope to provided section)
    const availIndex = (project.MaterialAvailable || []).findIndex(
      (m: MaterialSubdoc) => {
        try {
          const sameId =
            String((m as unknown as { _id: string | Types.ObjectId })._id) ===
            String(materialId);
          // Accept the available entry if it is global (no sectionId) OR it matches the requested sectionId
          const sameSection =
            !(m as unknown as { sectionId?: string }).sectionId ||
            String((m as unknown as { sectionId?: string }).sectionId) ===
              String(sectionId || "");
          return sameId && sameSection;
        } catch {
          return false;
        }
      }
    );

    if (availIndex == null || availIndex < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Material not found in MaterialAvailable",
        },
        { status: 404 }
      );
    }

    const available = project.MaterialAvailable![availIndex] as MaterialSubdoc;
    const costOfUsedMaterial = Number(available.cost || 0);

    // Check sufficient quantity (coerce stored qnt to Number)
    if (Number(available.qnt || 0) < qnt) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient quantity available. Available: ${Number(available.qnt || 0)}, Requested: ${qnt}`,
        },
        { status: 400 }
      );
    }

    // Prepare used material clone (include section/miniSection IDs)
    const usedClone: MaterialSubdoc = {
      name: available.name,
      unit: available.unit,
      specs: available.specs || {},
      qnt: qnt,
      cost: available.cost || 0,
      sectionId: String(sectionId),
      miniSectionId:
        miniSectionId ||
        (available as unknown as { miniSectionId?: string }).miniSectionId ||
        undefined,
    };

    // Use findByIdAndUpdate with $inc and array operations
    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      {
        $inc: {
          "MaterialAvailable.$[elem].qnt": -qnt,
          spent: costOfUsedMaterial,
        },
        $push: {
          MaterialUsed: usedClone,
        },
      },
      {
        arrayFilters: [{ "elem._id": new ObjectId(materialId) }],
        new: true,
        fields: {
          MaterialAvailable: 1,
          MaterialUsed: 1,
          spent: 1,
        },
      }
    );

    if (!updatedProject) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update project",
        },
        { status: 500 }
      );
    }

    // Clean up: remove materials with 0 or negative quantity
    const cleanedProject = await Projects.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          MaterialAvailable: { qnt: { $lte: 0 } },
        },
      },
      { new: true }
    );

    // Return success with updated data
    return NextResponse.json(
      {
        success: true,
        message: `Successfully added ${qnt} ${available.unit} of ${available.name} to used materials`,
        data: {
          projectId: cleanedProject?._id,
          sectionId: sectionId,
          miniSectionId: miniSectionId,
          materialAvailable: cleanedProject?.MaterialAvailable,
          materialUsed: cleanedProject?.MaterialUsed,
          usedMaterial: usedClone,
          spent: cleanedProject?.spent,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in add-material-usage:", msg);
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
};
