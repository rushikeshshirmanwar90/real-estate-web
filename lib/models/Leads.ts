import { model, models, Schema } from "mongoose";

const projectDetailsSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const buildingDetailsSchema = new Schema({
  buildingName: {
    type: String,
    required: true,
  },
  buildingId: {
    type: String,
    required: true,
  },
  flatName: {
    type: String,
    required: true,
  },
  flatId: {
    type: String,
    required: true,
  },
});

const rowHouseDetailsSchema = new Schema({
  rowHouseName: {
    type: String,
    required: true,
  },
  rowHouseId: {
    type: String,
    required: true,
  },
});

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },

    projectDetails: {
      type: projectDetailsSchema,
      required: true,
    },

    interestedType: {
      type: String,
      enum: ["building", "rowhouse"],
      required: true,
    },

    buildingDetails: {
      type: buildingDetailsSchema,
      required: false,
    },

    rowHouseDetails: {
      type: rowHouseDetailsSchema,
      required: false,
    },
  },
  { timestamps: true }
);

const Lead = models.Lead || model("Lead", leadSchema);

export { Lead };
