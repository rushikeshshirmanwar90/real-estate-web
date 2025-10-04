import { model, models, Schema } from "mongoose";

const OtherSectionSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  projectId: {
    type: String,
    require: true,
  },

  images: {
    type: [String],
    require: false,
  },

  area: {
    type: Number,
    require: false,
  },

  description: {
    type: String,
    require: false,
  },
});

export const OtherSection =
  models.OtherSection || model("OtherSection", OtherSectionSchema);
