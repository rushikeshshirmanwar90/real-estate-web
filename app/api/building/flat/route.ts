import { Building } from "@/lib/models/Building";
import { RowHouse } from "@/lib/models/RowHouse";
import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { CustomerDetails } from "@/lib/models/CustomerDetails";
import mongoose from "mongoose";
import { Property as PropertyProps } from "@/components/types/customer";
import { BuildingDoc, DetailedProperty, RowHouseDoc } from "@/types/types";

export const GET = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId not found" },
        { status: 404 }
      );
    }

    // Get customer property information
    const customerDetails = (await CustomerDetails.findOne({
      userId: userId,
    }).lean()) as { userId: string; property: PropertyProps[] } | null;

    if (!customerDetails) {
      return NextResponse.json(
        { message: "Can't find properties for this user" },
        { status: 404 }
      );
    }

    const properties: PropertyProps[] = customerDetails.property;

    // Prepare detailed property information
    const detailedProperties: DetailedProperty[] = await Promise.all(
      properties.map(async (property) => {
        // Initialize with base property info
        let detailedProperty: DetailedProperty = {
          ...property,
          propertyDetails: null,
        };

        try {
          // If sectionType is "Buildings", fetch from Building model
          if (property.sectionType === "Buildings" && property.flatId) {
            const buildingDoc = (await Building.findById(
              new mongoose.Types.ObjectId(property.sectionId)
            ).lean()) as unknown as BuildingDoc;

            if (buildingDoc) {
              // Find the specific flat in the building's flatInfo array
              const flatDetails = buildingDoc.flatInfo?.find(
                (flat) => flat._id.toString() === property.flatId
              );

              if (flatDetails) {
                // Clean up the flat details to remove internal Mongoose properties
                const cleanFlatDetails = {
                  _id: flatDetails._id.toString(),
                  title: flatDetails.title,
                  description: flatDetails.description,
                  images: flatDetails.images,
                  totalFlats: flatDetails.totalFlats,
                  totalBookedFlats: flatDetails.totalBookedFlats,
                  bhk: flatDetails.bhk,
                  totalArea: flatDetails.totalArea,
                  video: flatDetails.video,
                };

                // Clean up the building details
                const buildingDetails = {
                  name: buildingDoc.name,
                  location: buildingDoc.location,
                  area: buildingDoc.area,
                  images: buildingDoc.images,
                  amenities: buildingDoc.amenities.map((amenity) => ({
                    icon: amenity.icon,
                    name: amenity.name,
                    _id: amenity._id.toString(),
                  })),
                };

                detailedProperty.propertyDetails = {
                  type: "flat",
                  data: cleanFlatDetails,
                  buildingDetails,
                };
              }
            }
          }
          // If sectionType is "row house", fetch from RowHouse model
          else if (property.sectionType === "row house") {
            const rowHouseDoc = (await RowHouse.findById(
              new mongoose.Types.ObjectId(property.sectionId)
            ).lean()) as unknown as RowHouseDoc;

            if (rowHouseDoc) {
              // Clean up the row house data
              const rowHouseData = {
                _id: rowHouseDoc._id.toString(),
                name: rowHouseDoc.name,
                description: rowHouseDoc.description,
                images: rowHouseDoc.images,
                totalHouse: rowHouseDoc.totalHouse,
                bookedHouse: rowHouseDoc.bookedHouse,
                area: rowHouseDoc.area,
                projectId: rowHouseDoc.projectId.toString(),
                amenities: rowHouseDoc.amenities.map((amenity) => ({
                  icon: amenity.icon,
                  name: amenity.name,
                  _id: amenity._id.toString(),
                })),
              };

              detailedProperty.propertyDetails = {
                type: "rowHouse",
                data: rowHouseData,
              };
            }
          }
        } catch (error) {
          console.log(
            `Error fetching details for property ${property.id}:`,
            error
          );
        }

        return detailedProperty;
      })
    );

    return NextResponse.json(
      {
        userId: customerDetails.userId,
        properties: detailedProperties,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Error fetching property details:", error);
    return NextResponse.json(
      {
        message: "Unable to fetch property details",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
