import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { CustomerDetails } from "@/lib/models/CustomerDetails";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // If userId is provided, fetch that specific user
    if (userId) {
      const user = await User.findById(userId).populate("properties");

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Return just the user with populated properties
      return NextResponse.json(user, { status: 200 });
    }

    // If no userId provided, fetch all users with populated properties
    const users = await User.find().populate("properties");

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while fetching users" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const data = await req.json();

    let userData = { ...data };
    let propertiesData;

    const { email, phoneNumber } = data;

    const findUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (findUser) {
      return NextResponse.json(
        {
          message:
            "User Already Exits, please register with another email and phone number",
        },
        {
          status: 409,
        }
      );
    }

    if (data.userType === "customer") {
      propertiesData = userData.properties;
      delete userData.properties;

      if (userData.password) {
        delete userData.password;
      }
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (!savedUser) {
      return NextResponse.json(
        {
          message: "Unknown error occurred, couldn't add the user",
        },
        { status: 404 }
      );
    }
    if (
      data.userType === "customer" &&
      propertiesData &&
      propertiesData.length > 0
    ) {
      const customerDetailsData = {
        userId: savedUser._id,
        property: propertiesData.map((prop: any) => ({
          id: prop.id,
          projectId: prop.projectId,
          projectName: prop.projectName,
          sectionId: prop.sectionId,
          sectionName: prop.sectionName,
          sectionType: prop.sectionType,
          flatId: prop.flatId || "",
          flatName: prop.flatName || "",
        })),
      };

      const newCustomerDetails = new CustomerDetails(customerDetailsData);
      const savedCustomerDetails = await newCustomerDetails.save();

      // Update the user with reference to CustomerDetails
      await User.findByIdAndUpdate(savedUser._id, {
        properties: savedCustomerDetails._id,
      });

      // Fetch the updated user with populated properties
      const updatedUser = await User.findById(savedUser._id);

      // Return the complete user with customer details
      return NextResponse.json(
        {
          user: updatedUser,
          customerDetails: savedCustomerDetails,
        },
        { status: 200 }
      );
    }

    // For staff users, just return the saved user
    return NextResponse.json(savedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: error.message,
        message: "An Error occur while creating the user",
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connect();

    // Get user ID from URL or params
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get update data from request body
    const updateData = await req.json();

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Handle properties update for customer users
    let propertiesData;
    if (user.userType === "customer" && updateData.properties) {
      // Extract properties from update data
      propertiesData = updateData.properties;
      delete updateData.properties;
    }

    // If it's a customer, ensure password is removed
    if (user.userType === "customer" && updateData.password) {
      delete updateData.password;
    }

    // Update user basic info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // Return updated document
    );

    // Update properties if needed
    if (user.userType === "customer" && propertiesData && user.properties) {
      // Update existing CustomerDetails
      await CustomerDetails.findByIdAndUpdate(
        user.properties,
        {
          $set: {
            property: propertiesData.map((prop: any) => ({
              id: prop.id,
              projectId: prop.projectId,
              projectName: prop.projectName,
              sectionId: prop.sectionId,
              sectionName: prop.sectionName,
              sectionType: prop.sectionType,
              flatId: prop.flatId || "",
              flatName: prop.flatName || "",
            })),
          },
        },
        { new: true }
      );
    } else if (
      user.userType === "customer" &&
      propertiesData &&
      !user.properties
    ) {
      // Create new CustomerDetails if it doesn't exist
      const customerDetailsData = {
        userId: user._id,
        property: propertiesData.map((prop: any) => ({
          id: prop.id,
          projectId: prop.projectId,
          projectName: prop.projectName,
          sectionId: prop.sectionId,
          sectionName: prop.sectionName,
          sectionType: prop.sectionType,
          flatId: prop.flatId || "",
          flatName: prop.flatName || "",
        })),
      };

      const newCustomerDetails = new CustomerDetails(customerDetailsData);
      const savedCustomerDetails = await newCustomerDetails.save();

      // Update user with reference to new CustomerDetails
      await User.findByIdAndUpdate(
        userId,
        { properties: savedCustomerDetails._id },
        { new: true }
      );
    }

    // Fetch the final updated user with populated properties
    const finalUpdatedUser = await User.findById(userId).populate("properties");

    return NextResponse.json(finalUpdatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while updating the user" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Id must needed for this API request",
        },
        { status: 402 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "can't able to delete the user",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
