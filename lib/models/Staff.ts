import { models, model, Schema } from "mongoose";

const StaffSchema = new Schema({
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
  role: {
    type: String,
    enum: ["site-engineer", "material-manager"],
    required: true,
  },
  assignSites: {
    type: [String],
    required: false,
  },
});

export const Staff = models.Staff || model("Staff", StaffSchema);
