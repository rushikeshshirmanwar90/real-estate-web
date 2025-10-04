import { models, model, Schema } from "mongoose";

const AdminSchema = new Schema({
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
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: false,
  },

  clientId: {
    type: String,
    required: true,
  },
});

export const Admin = models.Admin || model("Admin", AdminSchema);
