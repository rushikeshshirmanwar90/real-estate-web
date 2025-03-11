import { Building } from "@/lib/models/Building";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/lib/models/Users";
import { CustomerDetails } from "@/lib/models/CustomerDetails";

export const GET = async (req: Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    const userProperties = await User.findById(userId).populate("properties");

    if (!userProperties?.properties?.property?.length) {
      return NextResponse.json(
        {
          message: "No properties found for this user",
        },
        { status: 404 }
      );
    }

    const flatIds = userProperties.properties.property.map(
      (prop: any) => prop.flatId
    );

    const buildings = await Building.find({
      "flatInfo._id": { $in: flatIds },
    });

    if (!buildings.length) {
      return NextResponse.json(
        {
          message: "No buildings found containing these flats",
        },
        { status: 404 }
      );
    }

    const flatInfos = flatIds
      .map((flatId: any) => {
        const building = buildings.find((b) =>
          b.flatInfo.some((f: any) => f._id.toString() === flatId)
        );

        if (!building) return null;

        const flatInfo = building.flatInfo.find(
          (f: any) => f._id.toString() === flatId
        );

        return {
          flatInfo: flatInfo
            ? {
                id: flatInfo._id,
                title: flatInfo.title,
                description: flatInfo.description,
                images: flatInfo.images,
                totalFlats: flatInfo.totalFlats,
                totalBookedFlats: flatInfo.totalBookedFlats,
                bhk: flatInfo.bhk,
                totalArea: flatInfo.totalArea,
                video: flatInfo.video,
              }
            : null,
          building: {
            id: building._id,
            name: building.name,
            projectId: building.projectId,
            location: building.location,
          },
          propertyDetails: userProperties.properties.property.find(
            (prop: any) => prop.flatId === flatId
          ),
        };
      })
      .filter((info: any) => info !== null);

    return NextResponse.json(
      {
        message: "Flat information retrieved successfully",
        data: flatInfos,
        total: flatInfos.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching flat infos:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching flat information",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
