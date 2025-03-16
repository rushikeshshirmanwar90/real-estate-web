import mongoose, { Schema } from "mongoose";

const PropertySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    sectionName: {
      type: String,
      required: true,
    },
    sectionType: {
      type: String,
      required: true,
      enum: ["row house", "Buildings"],
    },
    flatId: {
      type: String,
      required: false,
      default: "",
    },
    flatName: {
      type: String,
      required: true,
      default: "",
    },
  },
  { _id: false }
);

const CustomerDetailsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    property: {
      type: [PropertySchema],
      required: true,
    },
    flatInfoId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "FlatInfo",
    },
  },
  {
    timestamps: true,
  }
);

export const CustomerDetails =
  mongoose.models.CustomerDetails ||
  mongoose.model("CustomerDetails", CustomerDetailsSchema);
