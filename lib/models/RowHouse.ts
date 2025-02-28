import { model, models, Schema } from "mongoose";

const RowHouseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: false,
    },

    images: {
      type: [String],
      require: false,
    },

    totalHouse: {
      type: Number,
      require: true,
    },

    bookedHouse: {
      type: Number,
      require: true,
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

const RowHouse = models.RowHouse || model("RowHouse", RowHouseSchema);

export { RowHouse };
