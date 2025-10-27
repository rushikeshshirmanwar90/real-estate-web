import connect from "@/lib/db";
import { MiniSection } from "@/lib/models/Xsite/mini-section";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest | Request) => {
    try {
        await connect();
        const body = await req.json();

        // Expected body: { sectionId, materialId, qnt }
        const { sectionId, materialId, qnt } = body;

        // Validation
        if (!sectionId || !materialId || typeof qnt !== "number") {
            return NextResponse.json(
                { 
                    success: false,
                    error: "sectionId, materialId and numeric qnt are required" 
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

        // Find material in MaterialAvailable by _id
        const availIndex = section.MaterialAvailable?.findIndex(
            (m: any) => String(m._id) === String(materialId)
        );

        if (availIndex == null || availIndex < 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Material not found in MaterialAvailable" 
                }, 
                { status: 404 }
            );
        }

        const available = section.MaterialAvailable[availIndex];

        // Check sufficient quantity
        if (available.qnt < qnt) {
            return NextResponse.json(
                { 
                    success: false,
                    error: `Insufficient quantity available. Available: ${available.qnt}, Requested: ${qnt}` 
                }, 
                { status: 400 }
            );
        }

        // Reduce available quantity
        available.qnt = available.qnt - qnt;

        // Prepare used material clone
        const usedClone: any = {
            name: available.name,
            unit: available.unit,
            specs: available.specs || {},
            qnt: qnt,
            cost: available.cost || 0,
        };

        // If same material (matching name+unit+specs+cost) exists in MaterialUsed, add qnt there
        const usedIndex = section.MaterialUsed?.findIndex((m: any) => {
            try {
                return (
                    m.name === usedClone.name &&
                    m.unit === usedClone.unit &&
                    JSON.stringify(m.specs || {}) === JSON.stringify(usedClone.specs || {}) &&
                    Number(m.cost || 0) === Number(usedClone.cost || 0)
                );
            } catch (e) {
                return false;
            }
        });

        if (usedIndex != null && usedIndex >= 0) {
            // Add to existing used material
            section.MaterialUsed[usedIndex].qnt = 
                Number(section.MaterialUsed[usedIndex].qnt || 0) + qnt;
        } else {
            // Push new entry into MaterialUsed
            section.MaterialUsed = section.MaterialUsed || [];
            section.MaterialUsed.push(usedClone as any);
        }

        // If available quantity becomes zero, remove it from array
        if (available.qnt <= 0) {
            section.MaterialAvailable.splice(availIndex, 1);
        }

        // Save changes
        await section.save();

        // Return success with updated data
        return NextResponse.json(
            { 
                success: true,
                message: `Successfully added ${qnt} ${available.unit} of ${available.name} to used materials`,
                data: {
                    sectionId: section._id,
                    materialAvailable: section.MaterialAvailable,
                    materialUsed: section.MaterialUsed,
                    usedMaterial: usedClone
                }
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in add-material-usage:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error?.message || String(error) 
            }, 
            { status: 500 }
        );
    }
};
