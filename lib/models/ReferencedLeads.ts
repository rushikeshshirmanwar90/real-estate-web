import { model, models, Schema } from "mongoose";

const ReferenceCustomerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const LeadSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
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
