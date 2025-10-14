import { errorResponse, successResponse } from "@/lib/models/utils/API";
import { RequestedMaterial } from "@/lib/models/Xsite/request-material";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest | Request) => {
  try {
    const { isApproved, id } = await req.json();

    if (isApproved) {
      const updateRequest = await RequestedMaterial.findByIdAndUpdate(id, {
        status: "approved",
      });

      if (!updateRequest) {
        errorResponse("unable to approve the request please try again", 500);
      }

      successResponse(updateRequest, "request approved successfully", 200);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorResponse("something went wrong", 500, error.message);
    }

    errorResponse("something went wrong", 500);
  }
};
