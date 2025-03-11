import { models, model, Schema } from "mongoose";

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

    section: [
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
    ],

    flatInfo: [
      {
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
      },
    ],

    amenities: [
      {
        icon: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Building = models.Building || model("Building", buildingSchema);

export { Building };
