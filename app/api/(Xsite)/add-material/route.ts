import connect from "@/lib/db";
import { MiniSection } from "@/lib/models/Xsite/mini-section";
import { NextRequest, NextResponse } from "next/server";

interface AddMaterialStockRequest {
    sectionId: string;
    materialName: string;
    unit: string;
    specs?: Record<string, any>;
    qnt: number;
    cost: number;
    mergeIfExists?: boolean; // Optional: true = merge, false = create new batch
}

export const POST = async (req: NextRequest | Request) => {
    try {
        await connect();
        const body: AddMaterialStockRequest = await req.json();

        const { 
            sectionId, 
            materialName, 
            unit, 
            specs = {}, 
            qnt, 
            cost,
            mergeIfExists = true // Default: merge with existing
        } = body;

        // Validation
        if (!sectionId || !materialName || !unit || typeof qnt !== "number" || typeof cost !== "number") {
            return NextResponse.json(
                { 
                    success: false,
                    error: "sectionId, materialName, unit, qnt (number), and cost (number) are required" 
                }, 
                { status: 400 }
            );
        }

        if (qnt <= 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Quantity must be greater than 0" 
                }, 
                { status: 400 }
            );
        }

        if (cost < 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Cost cannot be negative" 
                }, 
                { status: 400 }
            );
        }

        // Find section
        const section = await MiniSection.findById(sectionId);
        if (!section) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "MiniSection not found" 
                }, 
                { status: 404 }
            );
        }

        // Initialize MaterialAvailable if not exists
        section.MaterialAvailable = section.MaterialAvailable || [];

        if (mergeIfExists) {
            // APPROACH 1: Merge with existing material
            const existingIndex = section.MaterialAvailable.findIndex((m: any) => {
                try {
                    return (
                        m.name === materialName &&
                        m.unit === unit &&
                        JSON.stringify(m.specs || {}) === JSON.stringify(specs)
                    );
                } catch (e) {
                    return false;
                }
            });

            if (existingIndex >= 0) {
                // Material exists - merge quantities and update cost
                const existing = section.MaterialAvailable[existingIndex];
                const oldQnt = existing.qnt || 0;
                const oldCost = existing.cost || 0;
                const newQnt = oldQnt + qnt;
                
                // Calculate weighted average cost or total cost
                // Option 1: Total cost (sum of all costs)
                const newCost = oldCost + cost;
                
                // Option 2: Weighted average cost (uncomment if preferred)
                // const newCost = ((oldCost * oldQnt) + (cost * qnt)) / newQnt;

                existing.qnt = newQnt;
                existing.cost = newCost;

                await section.save();

                return NextResponse.json(
                    { 
                        success: true,
                        message: `Successfully added ${qnt} ${unit} of ${materialName}. Total now: ${newQnt} ${unit}`,
                        action: "merged",
                        data: {
                            sectionId: section._id,
                            material: existing,
                            previousQuantity: oldQnt,
                            addedQuantity: qnt,
                            newQuantity: newQnt,
                            previousCost: oldCost,
                            addedCost: cost,
                            newCost: newCost
                        }
                    }, 
                    { status: 200 }
                );
            }
        }

        // APPROACH 2: Create new batch (or if material doesn't exist)
        const newMaterial = {
            name: materialName,
            unit: unit,
            specs: specs,
            qnt: qnt,
            cost: cost,
        };

        section.MaterialAvailable.push(newMaterial as any);
        await section.save();

        return NextResponse.json(
            { 
                success: true,
                message: `Successfully added ${qnt} ${unit} of ${materialName} as new batch`,
                action: "created",
                data: {
                    sectionId: section._id,
                    material: newMaterial,
                    addedQuantity: qnt,
                    addedCost: cost
                }
            }, 
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error in add-material-stock:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error?.message || String(error) 
            }, 
            { status: 500 }
        );
    }
};