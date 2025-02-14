import { model, models, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
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
      required: true,
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
    },

    section: [
      {
        name: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          required: true,
          enum: ["row-house", "buildings", "other"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Projects = models.Projects || model("Projects", projectSchema);

export { Projects };
