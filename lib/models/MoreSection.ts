import { model, models, Schema } from "mongoose";

const MoreSectionSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  image: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    require: true,
  },
});

const MoreSection =
  models.MoreSection || model("MoreSection", MoreSectionSchema);

export { MoreSection };
