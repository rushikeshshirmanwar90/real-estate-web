import connect from "@/lib/db";
import { ReferenceLeads } from "@/lib/models/ReferencedLeads";
import { NextRequest } from "next/server";

export const GET = async (req: Request | NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const referenceCustomerId = searchParams.get("referenceCustomerId");

    if (referenceCustomerId) {
      const referenceCustomer = await ReferenceLeads.find({
        "referenceCustomer.id": referenceCustomerId,
      });

      if (referenceCustomer.length > 0) {
        return new Response(JSON.stringify(referenceCustomer), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response("No reference customer found", { status: 404 });
      }
    } else {
      const referenceCustomers = await ReferenceLeads.find({});
      if (referenceCustomers.length > 0) {
        return new Response(JSON.stringify(referenceCustomers), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response("No reference customers found", { status: 404 });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    } else {
      return new Response("Unknown error", { status: 500 });
    }
  }
};


export const POST = async (req: Request | NextRequest) => {
  try {
    await connect();
    const { referenceCustomer, leads } = await req.json();
    
    if (!referenceCustomer || !leads || !referenceCustomer.contactNumber) {
      return new Response(JSON.stringify({ message: "Invalid data" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if reference customer already exists with the same contact number
    const existingReference = await ReferenceLeads.findOne({
      "referenceCustomer.contactNumber": referenceCustomer.contactNumber
    });

    if (existingReference) {
      // Customer exists, just add the new leads
      const updatedLeads = [...existingReference.leads, ...leads];
      
      // Update the document with new leads
      await ReferenceLeads.findByIdAndUpdate(
        existingReference._id,
        { leads: updatedLeads },
        { new: true }
      );

      return new Response(JSON.stringify({ 
        message: "Leads added to existing reference customer",
        customerId: existingReference.referenceCustomer.id
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Customer doesn't exist, create a new entry
      const newReferenceLeads = new ReferenceLeads({
        referenceCustomer,
        leads,
      });
      
      const savedReference = await newReferenceLeads.save();

      return new Response(JSON.stringify({ 
        message: "Reference leads created successfully",
        customerId: savedReference.referenceCustomer.id 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ message: "Unknown error" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};


export const DELETE = async (req: Request | NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const referenceCustomerId = searchParams.get("referenceCustomerId");
    const leadId = searchParams.get("leadId");

    if (!referenceCustomerId || !leadId) {
      return new Response("referenceCustomerId and leadId are required", {
        status: 400,
      });
    }

    if (leadId) {
      const deletedLead = await ReferenceLeads.updateMany(
        { "leads.id": leadId },
        { $pull: { leads: { id: leadId } } }
      );

      if (deletedLead.modifiedCount > 0) {
        return new Response("Lead deleted successfully", { status: 200 });
      } else {
        return new Response("No lead found to delete", { status: 404 });
      }
    }

    if (referenceCustomerId) {
      const deletedReferenceLeads = await ReferenceLeads.deleteMany({
        "referenceCustomer.id": referenceCustomerId,
      });

      if (deletedReferenceLeads.deletedCount > 0) {
        return new Response("Reference leads deleted successfully", {
          status: 200,
        });
      } else {
        return new Response("No reference leads found to delete", {
          status: 404,
        });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    } else {
      return new Response("Unknown error", { status: 500 });
    }
  }
};

export const PUT = async (req: Request | NextRequest) => {
  try {
    await connect();

    const { referenceCustomerId, leads } = await req.json();

    if (!referenceCustomerId || !leads) {
      return new Response("Invalid data", { status: 400 });
    }

    const updatedReferenceLeads = await ReferenceLeads.findOneAndUpdate(
      { "referenceCustomer.id": referenceCustomerId },
      { leads },
      { new: true }
    );

    if (updatedReferenceLeads) {
      return new Response("Reference leads updated successfully", {
        status: 200,
      });
    } else {
      return new Response("No reference leads found to update", {
        status: 404,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    } else {
      return new Response("Unknown error", { status: 500 });
    }
  }
};
