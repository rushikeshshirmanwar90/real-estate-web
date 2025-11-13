import { model, models, Schema } from "mongoose";

export const MaterialSchema = new Schema(
  {
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

    qnt: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      default: 0,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ImportedMaterialsSchema = new Schema({
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

  message: {
    type: String,
    required: false,
  },
});

export const ImportedMaterials =
  models.ImportedMaterials ||
  model("ImportedMaterials", ImportedMaterialsSchema);
