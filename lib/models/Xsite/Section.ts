import { model, models, Schema } from "mongoose";
import { MaterialSchema } from "./request-material";

const SectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    projectDetails: {
      projectName: {
        type: String,
        required: true,
        trim: true,
      },
      projectId: {
        type: String,
        required: true,
        trim: true,
      },
    },

    mainSectionDetails: {
      sectionName: {
        type: String,
        required: false,
        trim: true,
      },
      sectionId: {
        type: String,
        required: false,
        trim: true,
      },
    },

    MaterialUsed: {
      type: [MaterialSchema],
      required: false,
    },

    MaterialAvailable: {
      type: [MaterialSchema],
      required: false,
    },
  },
  { timestamps: true }
);

export const Section = models.Section || model("Section", SectionSchema);
