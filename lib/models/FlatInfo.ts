import { model, models, Schema } from "mongoose";

const flatInfoSchema = new Schema({
  flatId: {
    type: String,
    required: true,
  },

  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },

  FlatNumber: {
    type: Number,
    required: true,
  },

  isBooked: {
    type: Boolean,
    required: true,
    default: false,
  },

  bookingPrice: {
    type: Number,
    required: false,
  },

  owner: {
    name: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },

  rooms: [
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

      type: {
        type: String,
        required: true,
        enum: [
          "rooms",
          "bathroooms",
          "kitchens",
          "livingrooms",
          "balconies",
          "other",
        ],
      },
    },
  ],
});

export const FlatInfo = models.FlatInfo || model("FlatInfo", flatInfoSchema);
