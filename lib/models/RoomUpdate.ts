import { model, models, Schema } from "mongoose";

const roomUpdateSchema = new Schema({
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
    enum: ["rooms", "kitchen", "bathroom", "living-room", "balcony", "other"],
  },

  flatId: {
    type: Schema.Types.ObjectId,
    ref: "FlatInfo",
    required: true,
  },

  changes: {
    type: String,
    required: false,
  },
});

export default models.RoomUpdate || model("RoomUpdate", roomUpdateSchema);
