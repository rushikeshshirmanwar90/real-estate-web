import { models, model, Schema } from "mongoose";

const buildingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    totalFlats: {
      type: Number,
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      require: true,
    },

    MoreSection: {
      type: [
        {
          name: {
            type: String,
            require: true,
          },
          description: {
            type: String,
            require: true,
          },
          images: {
            type: [String],
            require: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Building = models.Building || model("Building", buildingSchema);

export { Building };
