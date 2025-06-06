import { model, models, Schema } from "mongoose";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      require: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
      required: true,
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Client = models.Client || model("Client", clientSchema);
