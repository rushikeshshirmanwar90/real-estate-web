import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: "number",
      require: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
    },

    userType: {
      type: String,
      required: true,
      enum: ["customer", "staff"],
    },

    flatId: {
      type: String,
      required: false,
    },

    flatInfoId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "FlatInfo",
    },

    password: {
      type: String,
      require: false,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export { User };
