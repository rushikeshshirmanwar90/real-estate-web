import connect from "@/lib/db";
import { Projects } from "@/lib/models/Project";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest | Request) => {

    const {searchParams} = new URL((req as NextRequest).url);
    const projectId = searchParams.get('projectId');

    try {
        
        await connect();

        if (!projectId) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "projectId is required" 
                }, 
                { status: 400 }
            );
        }

        const projects = await Projects.findById(projectId).select('MaterialAvailable'); 

        if (!projects) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Project not found" 
                }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true,
                materialAvailable: projects.MaterialAvailable || [] 
            }, 
            { status: 200 }
        );


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
}