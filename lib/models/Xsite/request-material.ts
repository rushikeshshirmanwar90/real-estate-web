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

  materials: {
    type: [MaterialSchema],
    required: true,
  },

  approved: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export const RequestedMaterial =
  models.RequestedMaterial ||
  model("RequestedMaterial", RequestedMaterialSchema);
