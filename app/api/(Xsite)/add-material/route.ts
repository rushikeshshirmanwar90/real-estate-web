import connect from "@/lib/db";
import { Projects } from "@/lib/models/Project";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

type Specs = Record<string, unknown>;

type AddMaterialStockItem = {
    projectId: string;
    materialName: string;
    unit: string;
    specs?: Specs;
    qnt: number | string;
    cost: number | string;
    mergeIfExists?: boolean; // Optional: true = merge, false = create new batch
}

type MaterialSubdoc = {
    _id?: Types.ObjectId | string;
    name: string;
    unit: string;
    specs?: Specs;
    qnt: number;
    cost?: number;
};

export const POST = async (req: NextRequest | Request) => {
    try {
        await connect();
        const raw = await req.json();

        const items: AddMaterialStockItem[] = Array.isArray(raw) ? raw : [raw];

        if (items.length === 0) {
            return NextResponse.json({ success: false, error: "No materials provided" }, { status: 400 });
        }

        const results: Array<{
            input: Partial<AddMaterialStockItem>;
            success: boolean;
            action?: "merged" | "created";
            message?: string;
            material?: MaterialSubdoc;
            error?: string;
        }> = [];

        for (const item of items) {
            const {
                projectId,
                materialName,
                unit,
                specs = {},
                qnt: rawQnt,
                cost: rawCost,
                mergeIfExists = true,
            } = item as AddMaterialStockItem;

            const resultBase = { input: item, success: false };

            // Basic validation and coercion
            const qnt = typeof rawQnt === "string" ? Number(rawQnt) : rawQnt;
            const cost = typeof rawCost === "string" ? Number(rawCost) : rawCost;

            if (!projectId || !materialName || !unit) {
                results.push({ ...resultBase, error: "projectId, materialName and unit are required" });
                continue;
            }

            if (typeof qnt !== "number" || Number.isNaN(qnt)) {
                results.push({ ...resultBase, error: "qnt must be a number" });
                continue;
            }

            if (typeof cost !== "number" || Number.isNaN(cost)) {
                results.push({ ...resultBase, error: "cost must be a number" });
                continue;
            }

            if (qnt <= 0) {
                results.push({ ...resultBase, error: "Quantity must be greater than 0" });
                continue;
            }

            if (cost < 0) {
                results.push({ ...resultBase, error: "Cost cannot be negative" });
                continue;
            }

            // Find project
            const project = await Projects.findById(projectId);
            if (!project) {
                results.push({ ...resultBase, error: "project not found" });
                continue;
            }

            project.MaterialAvailable = project.MaterialAvailable || [];

            if (mergeIfExists) {
                const availableArr = project.MaterialAvailable as MaterialSubdoc[];
                const existingIndex = availableArr.findIndex((m: MaterialSubdoc) => {
                    try {
                        return (
                            m.name === materialName &&
                            m.unit === unit &&
                            JSON.stringify(m.specs || {}) === JSON.stringify(specs)
                        );
                    } catch (_e) {
                        return false;
                    }
                });

                if (existingIndex >= 0) {
                    const existing = (project.MaterialAvailable as MaterialSubdoc[])[existingIndex];
                    const oldQnt = Number(existing.qnt || 0);
                    const oldCost = Number(existing.cost || 0);
                    const newQnt = oldQnt + qnt;
                    const newCost = oldCost + cost; // keep existing approach (sum of costs)

                    existing.qnt = newQnt;
                    existing.cost = newCost;

                    await project.save();

                    results.push({
                        ...resultBase,
                        success: true,
                        action: "merged",
                        message: `Merged ${qnt} ${unit} of ${materialName}. Total now: ${newQnt} ${unit}`,
                        material: existing as MaterialSubdoc,
                    });
                    continue;
                }
            }

            // Create new batch
            const newMaterial: MaterialSubdoc = {
                name: materialName,
                unit,
                specs: specs || {},
                qnt: Number(qnt),
                cost: Number(cost),
            };

            project.MaterialAvailable.push(newMaterial);
            await project.save();

            results.push({
                ...resultBase,
                success: true,
                action: "created",
                message: `Created new batch: ${qnt} ${unit} of ${materialName}`,
                material: newMaterial,
            });
        }

        return NextResponse.json({ success: true, results }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in add-material-stock:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: error?.message || String(error)
                },
                { status: 500 }
            );
        } else {
            console.error("Error in add-material-stock:", error);
        return NextResponse.json(
            {
                success: false,
                error: error || String(error)
            },
            { status: 500 }
        );
        }

    }
};