import { model, models, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    images: {
      type: [String],
      require: true,
    },

    state: {
      type: String,
      require: true,
    },

    city: {
      type: String,
      require: true,
    },

    area: {
      type: String,
      require: true,
    },

    address: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      require: true,
    },

    projectType: {
      type: String,
      require: true,
      enum: ["On-Going", "up-coming", "completed"],
    },

    totalSections: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Projects = models.Projects || model("Projects", projectSchema);

export { Projects };
