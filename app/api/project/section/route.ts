import { NextResponse } from "next/server";
import { Projects } from "@/lib/models/Project";
import { Building } from "@/lib/models/Building";
import connect from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const sectionId = searchParams.get("sectionId");

    if (!projectId || !sectionId) {
      return NextResponse.json(
        { error: "Project ID and Section ID are required" },
        { status: 400 }
      );
    }

    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      {
        $pull: { section: { sectionId: sectionId } },
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const deletedBuilding = await Building.findByIdAndDelete(sectionId);

    if (!deletedBuilding) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Section and building deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting section and building:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
