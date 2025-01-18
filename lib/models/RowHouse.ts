import { model, models, Schema } from "mongoose";

const RowHouseSchema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },

    name: {
      type: String,
      require: true,
    },

    total: {
      type: Number,
      require: true,
    },

    images: {
      type: [String],
      require: true,
    },

    BHK: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const RowHouse = models.RowHouse || model("RowHouse", RowHouseSchema);

export { RowHouse };
