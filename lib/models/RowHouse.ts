import { model, models, Schema } from "mongoose";
import { AmenitiesSchema } from "./utils/Amenities";

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

    amenities: {
      type: [AmenitiesSchema],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const RowHouse = models.RowHouse || model("RowHouse", RowHouseSchema);

export { RowHouse };
