import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { CustomerDetails } from "@/lib/models/CustomerDetails";
interface UserBase {
  email: string;
  phoneNumber: string;
  userType: "customer" | "staff" | "admin";
  name?: string;
  password?: string;
  properties?: string; // ObjectId reference
}

// For POST and PUT requests
interface UserCreateRequest {
  email: string;
  phoneNumber: string;
  userType: "customer" | "staff" | "admin";
  name?: string;
  password?: string;
  properties?: PropertyInput[];
}

// For GET response
interface UserResponse {
  _id: string;
  email: string;
  phoneNumber: string;
  userType: "customer" | "staff" | "admin";
  name?: string;
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

// CustomerDetails interfaces
interface CustomerDetailsBase {
  userId: string;
  property: PropertyOutput[];
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

// Request parameters
interface UserIdParam {
  userId: string;
}
// CustomerDetails interfaces
interface CustomerDetailsBase {
  userId: string;
  property: PropertyOutput[];
}

interface CustomerDetailsResponse extends CustomerDetailsBase {
  _id: string;
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

// Request parameters
interface UserIdParam {
  userId: string;
}

export type {
  UserBase,
  UserCreateRequest,
  UserResponse,
  PropertyInput,
  PropertyOutput,
  CustomerDetailsBase,
  CustomerDetailsResponse,
  UserWithDetailsResponse,
  ErrorResponse,
  UserIdParam,
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
            "User Already Exits, please register with another email and phone number",
        } as ErrorResponse,
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
        } as ErrorResponse,
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
      const updatedUser = (await User.findById(savedUser._id)) as UserResponse;

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
        message: "An Error occur while creating the user",
      } as ErrorResponse,
      { status: 500 }
    );
  }
};
