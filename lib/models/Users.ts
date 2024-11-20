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

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },

    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export { User };