import connect from "@/lib/db";
import { MiniSection } from "@/lib/models/Xsite/mini-section";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest | Request) => {
    try {
        await connect();

        const body = await req.json();
        // expected body: { sectionId, materialId, qnt }
        const { sectionId, materialId, qnt } = body;

        if (!sectionId || !materialId || typeof qnt !== "number") {
            return NextResponse.json({ error: "sectionId, materialId and numeric qnt are required" }, { status: 400 });
        }

        const section = await MiniSection.findById(sectionId);
        if (!section) {
            return NextResponse.json({ error: "MiniSection not found" }, { status: 404 });
        }

        // Find material in MaterialAvailable by _id
        const availIndex = section.MaterialAvailable?.findIndex((m: any) => String(m._id) === String(materialId));

        if (availIndex == null || availIndex < 0) {
            return NextResponse.json({ error: "Material not found in MaterialAvailable" }, { status: 404 });
        }

        const available = section.MaterialAvailable[availIndex];

        if (available.qnt < qnt) {
            return NextResponse.json({ error: "Insufficient quantity available" }, { status: 400 });
        }

        // reduce available qnt
        available.qnt = available.qnt - qnt;

        // prepare used material clone
        const usedClone: any = {
            name: available.name,
            unit: available.unit,
            specs: available.specs,
            qnt: qnt,
            cost: available.cost,
        };

        // If same material (matching name+unit+specs+cost) exists in MaterialUsed, add qnt there, else push
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
            section.MaterialUsed[usedIndex].qnt = Number(section.MaterialUsed[usedIndex].qnt || 0) + qnt;
        } else {
            // push into MaterialUsed
            section.MaterialUsed = section.MaterialUsed || [];
            section.MaterialUsed.push(usedClone as any);
        }

        // if available.qnt becomes zero, remove it from array
        if (available.qnt <= 0) {
            section.MaterialAvailable.splice(availIndex, 1);
        }

        await section.save();

        return NextResponse.json({ success: true, section }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
    }
};

