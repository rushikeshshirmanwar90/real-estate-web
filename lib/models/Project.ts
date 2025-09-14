import { model, models, Schema } from "mongoose";
import { AmenitiesSchema } from "./utils/Amenities";

const SectionSchema = new Schema(
  {
    sectionId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["row house", "building", "other"],
    },
  },
  { _id: true }
);

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: false,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    projectType: {
      type: String,
      required: true,
      enum: ["ongoing", "upcoming", "completed"],
      default: "ongoing",
    },

    longitude: {
      type: Number,
      required: false,
    },

    latitude: {
      type: Number,
      required: false,
    },

    section: {
      type: [SectionSchema],
      required: false,
    },

    amenities: {
      type: [AmenitiesSchema],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Projects = models.Projects || model("Projects", projectSchema);

export { Projects };
