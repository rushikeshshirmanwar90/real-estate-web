import { model, models, Schema } from "mongoose";

const RHouseSchema = new Schema({
  totalHouse: {
    type: Number,
    require: true,
  },

  name: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    require: false,
  },

  mainHouseImages: {
    type: String,
    require: true,
  },

  MoreSection: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: false,
        },

        images: {
          type: [String],
          required: true,
        },
      },
    ],
    required: false,
  },
});

const RHouse = models.RHouse || model("RHouse", RHouseSchema);

export { RHouse };
