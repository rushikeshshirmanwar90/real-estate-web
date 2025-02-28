import { model, models, Schema } from "mongoose";

const OtherSectionSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  images: {
    type: [String],
    require: true,
  },

  area: {
    type: Number,
    require: true,
  },

  projectId: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    require: true,
  },
});

export const OtherSection =
  models.OtherSection || model("OtherSection", OtherSectionSchema);
