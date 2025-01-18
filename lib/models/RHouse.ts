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
          require: true,
        },

        description: {
          type: String,
          require: false,
        },

        images: {
          type: [String],
          require: true,
        },
      },
    ],
    require: false,
  },
});

const RHouse = models.RHouse || model("RHouse", RHouseSchema);

export { RHouse };
