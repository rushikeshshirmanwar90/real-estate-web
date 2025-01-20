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

    totalRowHouseTypes: {
      type: Number,
      require: true,
    },

    images: {
      type: [String],
      require: false,
    },
    
    totalHouse: {
      type: Number,
      require: true,
    },

    description: {
      type: String,
      require: false,
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
  },
  {
    timestamps: true,
  }
);

const RowHouse = models.RowHouse || model("RowHouse", RowHouseSchema);

export { RowHouse };
