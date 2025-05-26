import { models, model, Schema } from "mongoose";
import { AmenitiesSchema } from "./utils/Amenities";

const SectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [String],
  },
  { _id: true }
);

const FlatInfoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  images: {
    type: [String],
    required: true,
  },

  totalFlats: {
    type: Number,
    required: true,
  },

  totalBookedFlats: {
    type: Number,
    required: true,
  },

  bhk: {
    type: Number,
    required: true,
  },

  totalArea: {
    type: Number,
    required: true,
  },

  video: {
    type: String,
  },
});

const buildingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    area: {
      type: Number,
      require: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      require: true,
    },

    images: {
      type: [String],
      required: true,
    },

    section: {
      type: [SectionSchema],
      required: false,
    },

    flatInfo: {
      type: [FlatInfoSchema],
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

const Building = models.Building || model("Building", buildingSchema);

export { Building };
