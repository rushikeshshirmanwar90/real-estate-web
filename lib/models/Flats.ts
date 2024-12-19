import { Schema, model, models } from "mongoose";

const flatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    building: {
      type: Schema.Types.ObjectId,
      require: true,
    },

    BHK: {
      type: Number,
      require: true,
    },

    area: {
      type: Number,
      require: true,
    },

    description: {
      type: String,
      require: false,
    },

    total: {
      type: Number,
      require: true,
    },

    booked: {
      type: Number,
      require: true,
    },

    images: {
      type: [String],
      require: true,
    },

    ytLink: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Flats = models.Flats || model("Flats", flatSchema);

export { Flats };
