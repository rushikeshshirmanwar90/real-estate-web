import { model, models, Schema } from "mongoose";
import { AmenitiesSchema } from "./utils/Amenities";
import { MaterialSchema } from "./Xsite/request-material";

const RowHouseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    totalHouse: {
      type: Number,
      require: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
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

    bookedHouse: {
      type: Number,
      require: false,
    },

    area: {
      type: Number,
      require: false,
    },

    amenities: {
      type: [AmenitiesSchema],
      required: false,
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
  {
    timestamps: true,
  }
);

const RowHouse = models.RowHouse || model("RowHouse", RowHouseSchema);

export { RowHouse };
