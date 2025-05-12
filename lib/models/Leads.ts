import { model, models, Schema } from "mongoose";

const propertyDetailsSchema = new Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const leadSchema = new Schema(
  {
    clientId: {
      type: String,
      required: true,
    },

    name: { type: String, required: true },
    phone: { type: String, required: true },

    projectName: {
      type: String,
      required: true,
    },

    interestedType: {
      type: String,
      enum: ["building", "rowhouse"],
      required: true,
    },

    propertyDetails: {
      type: propertyDetailsSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Lead = models.Lead || model("Lead", leadSchema);

export { Lead };