import { model, models, Schema } from "mongoose";

export const MaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  specs: {
    type: Object,
    default: {},
  },
  qnt : {
    type : Number,
    required : true,
  },
  cost: {
    type: Number,
    default: 0,
  },
});

const RequestedMaterialSchema = new Schema({
  clientId: {
    type: String,
    required: true,
  },

  projectId: {
    type: String,
    required: true,
  },

  mainSectionId: {
    type: String,
    required: true,
  },

  sectionId: {
    type: String,
    required: true,
  },

  materials: {
    type: [MaterialSchema],
    required: true,
  },

  status: {
    type: String,
    required: false,
    enum: ["pending", "approved", "rejected", "imported"],
    default: "pending",
  },

  message: {
    type: String,
    required: false,
  },
});

export const RequestedMaterial =
  models.RequestedMaterial ||
  model("RequestedMaterial", RequestedMaterialSchema);
