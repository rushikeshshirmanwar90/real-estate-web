import { timeStamp } from "console";
import { model, models, Schema } from "mongoose";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: Number,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Client = models.Client || model("Client", clientSchema);
