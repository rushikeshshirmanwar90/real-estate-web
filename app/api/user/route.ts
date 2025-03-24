import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { CustomerDetails } from "@/lib/models/CustomerDetails";

// For POST and PUT requests
interface UserCreateRequest {
  email: string;
  phoneNumber: string;
  userType: "customer" | "staff" | "admin";
  name?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  properties?: PropertyInput[];
  clientId?: string;
}

// For GET response
interface UserResponse {
  _id: string;
  email: string;
  phoneNumber: string;
  userType: "customer" | "staff" | "admin";
  name?: string;
  firstName?: string;
  lastName?: string;
  properties?: CustomerDetailsResponse;
  createdAt?: string;
  updatedAt?: string;
}

// Property related interfaces
interface PropertyInput {
  id: string;
  projectId: string;
  projectName: string;
  sectionId: string;
  sectionName: string;
  sectionType: string;
  flatId?: string;
  flatName?: string;
}

interface PropertyOutput {
  id: string;
  projectId: string;
  projectName: string;
  sectionId: string;
  sectionName: string;
  sectionType: string;
  flatId: string;
  flatName: string;
  _id?: string;
}

interface CustomerDetailsResponse {
  _id: string;
  userId: string;
  property: PropertyOutput[];
  createdAt?: string;
  updatedAt?: string;
}

// Response types
interface UserWithDetailsResponse {
  user: UserResponse;
  customerDetails: CustomerDetailsResponse;
}

// Error response type
interface ErrorResponse {
  message: string;
  error?: unknown;
}

export const GET = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let res;

    if (id) {
      // Find user by ID and populate the properties field
      res = await User.findById(id);
    } else {
      // Get all users and populate the properties field
      res = await User.find();
    }

    if (!res) {
      return NextResponse.json(
        {
          message: `Unable to get the data`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(res);
  } catch (error: unknown) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      {
        error: error,
        message: "An error occurred while fetching user data",
      } as ErrorResponse,
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();

    const data = (await req.json()) as UserCreateRequest;

    const userData = { ...data };
    let propertiesData: PropertyInput[] | undefined;

    const { email, phoneNumber } = data;

    const findUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (findUser) {
      return NextResponse.json(
        {
          message:
            "User Already Exists, please register with another email and phone number",
        } as ErrorResponse,
        {
          status: 409,
        }
      );
    }

    if (data.userType === "customer") {
      propertiesData = userData.properties;
      delete userData.properties;
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (!savedUser) {
      return NextResponse.json(
        {
          message: "Unknown error occurred, couldn't add the user",
        } as ErrorResponse,
        { status: 404 }
      );
    }

    if (
      data.userType === "customer" &&
      propertiesData &&
      propertiesData.length > 0
    ) {
      // Modified part: Now we're storing only the property IDs in the CustomerDetails
      const customerDetailsData = {
        userId: savedUser._id,
        // Just push the property id as requested
        property: propertiesData.map((prop: PropertyInput) => ({
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
      const updatedUser = await User.findById(savedUser._id).populate(
        "properties"
      );

      // Return the complete user with customer details
      return NextResponse.json(
        {
          user: updatedUser,
          customerDetails: savedCustomerDetails,
        } as UserWithDetailsResponse,
        { status: 200 }
      );
    }

    // For staff users, just return the saved user
    return NextResponse.json(savedUser as UserResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: error,
        message: "An error occurred while creating the user",
      } as ErrorResponse,
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    const data = (await req.json()) as Partial<UserCreateRequest>;

    // Check if email or phone number is being updated and if it's already in use
    if (data.email || data.phoneNumber) {
      const query = [];

      if (data.email) query.push({ email: data.email, _id: { $ne: id } });
      if (data.phoneNumber)
        query.push({ phoneNumber: data.phoneNumber, _id: { $ne: id } });

      if (query.length > 0) {
        const existingUser = await User.findOne({ $or: query });

        if (existingUser) {
          return NextResponse.json(
            {
              message: "Email or phone number already in use",
            } as ErrorResponse,
            { status: 409 }
          );
        }
      }
    }

    const userData = { ...data };
    let propertiesData: PropertyInput[] | undefined;

    if (userData.properties) {
      propertiesData = userData.properties;
      delete userData.properties;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" } as ErrorResponse, {
        status: 404,
      });
    }

    // If properties are being updated and user is a customer
    if (propertiesData && updatedUser.userType === "customer") {
      // Find existing customer details
      let customerDetails = await CustomerDetails.findOne({ userId: id });

      if (customerDetails) {
        // Update existing customer details
        customerDetails.property = propertiesData.map(
          (prop: PropertyInput) => ({
            id: prop.id,
            projectId: prop.projectId,
            projectName: prop.projectName,
            sectionId: prop.sectionId,
            sectionName: prop.sectionName,
            sectionType: prop.sectionType,
            flatId: prop.flatId || "",
            flatName: prop.flatName || "",
          })
        );

        await customerDetails.save();
      } else {
        // Create new customer details if not exist
        const customerDetailsData = {
          userId: updatedUser._id,
          property: propertiesData.map((prop: PropertyInput) => ({
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

        customerDetails = new CustomerDetails(customerDetailsData);
        await customerDetails.save();

        // Update the user with reference to CustomerDetails
        await User.findByIdAndUpdate(updatedUser._id, {
          properties: customerDetails._id,
        });
      }

      // Fetch the updated user with populated properties
      const finalUser = await User.findById(id).populate("properties");

      return NextResponse.json(
        {
          user: finalUser,
          customerDetails: customerDetails,
        } as UserWithDetailsResponse,
        { status: 200 }
      );
    }

    // For non-customer users or no property updates, return the updated user
    const finalUser = await User.findById(id).populate("properties");
    return NextResponse.json(finalUser, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error: error,
        message: "An error occurred while updating the user",
      } as ErrorResponse,
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    // First, find the user to check if it exists and get its type
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" } as ErrorResponse, {
        status: 404,
      });
    }

    // If the user is a customer, delete their customer details first
    if (user.userType === "customer") {
      await CustomerDetails.findOneAndDelete({ userId: id });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Error deleting user" } as ErrorResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: error,
        message: "An error occurred while deleting the user",
      } as ErrorResponse,
      { status: 500 }
    );
  }
};
