import { model, models, Schema } from "mongoose";

const ReferenceCustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: false }
);

const LeadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

const ReferencedLeadsSchema = new Schema({
  clientId: {
    type: String,
    required: true,
  },
  referenceCustomer: ReferenceCustomerSchema,
  leads: [LeadSchema],
});

export const ReferenceLeads =
  models.ReferencedLeads || model("ReferencedLeads", ReferencedLeadsSchema);
