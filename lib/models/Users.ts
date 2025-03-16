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
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    userType: {
      type: String,
      required: true,
      enum: ["customer", "staff"],
    },

    properties: {
      type: Schema.Types.ObjectId,
      ref: "CustomerDetails",
      required: false,
    },

    password: {
      type: String,
      required: false,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    otp: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export { User };
