import { Building } from "@/lib/models/Building";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/lib/models/Users";
import { Types } from "mongoose";

interface Property {
  flatId: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface UserProperties {
  properties: {
    property: Property[];
  };
  [key: string]: string | number | boolean | object | undefined;
}

interface FlatInfo {
  _id: string | Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  totalFlats: number;
  totalBookedFlats: number;
  bhk: number;
  totalArea: number;
  video: string;
  [key: string]:
    | string
    | number
    | boolean
    | object
    | string[]
    | Types.ObjectId
    | undefined;
}

interface BuildingDocument {
  _id: string | Types.ObjectId;
  name: string;
  projectId: string;
  location: string;
  flatInfo: FlatInfo[];
  [key: string]:
    | string
    | number
    | boolean
    | object
    | FlatInfo[]
    | Types.ObjectId
    | undefined;
}

interface FlatInfoResponse {
  flatInfo: {
    id: string | Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    totalFlats: number;
    totalBookedFlats: number;
    bhk: number;
    totalArea: number;
    video: string;
  } | null;
  building: {
    id: string | Types.ObjectId;
    name: string;
    projectId: string;
    location: string;
  };
  propertyDetails: Property;
}

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

    const userProperties = (await User.findById(userId).populate(
      "properties"
    )) as UserProperties;

    if (!userProperties?.properties?.property?.length) {
      return NextResponse.json(
        {
          message: "No properties found for this user",
        },
        { status: 404 }
      );
    }

    const flatIds = userProperties.properties.property.map(
      (prop: Property) => prop.flatId
    );

    const buildings = (await Building.find({
      "flatInfo._id": { $in: flatIds },
    })) as BuildingDocument[];

    if (!buildings.length) {
      return NextResponse.json(
        {
          message: "No buildings found containing these flats",
        },
        { status: 404 }
      );
    }

    const flatInfos = flatIds
      .map((flatId: string) => {
        const building = buildings.find((b) =>
          b.flatInfo.some((f: FlatInfo) => f._id.toString() === flatId)
        );

        if (!building) return null;

        const flatInfo = building.flatInfo.find(
          (f: FlatInfo) => f._id.toString() === flatId
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
            (prop: Property) => prop.flatId === flatId
          ),
        } as FlatInfoResponse;
      })
      .filter((info): info is FlatInfoResponse => info !== null);

    return NextResponse.json(
      {
        message: "Flat information retrieved successfully",
        data: flatInfos,
        total: flatInfos.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching flat infos:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching flat information",
        error: error,
      },
      { status: 500 }
    );
  }
};
