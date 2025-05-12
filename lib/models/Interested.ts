import { model, models, Schema } from "mongoose";

const PropertyDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const personalDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const interestedSchema = new Schema({
  PropertyDetails: {
    type: PropertyDetailsSchema,
    required: true,
  },

  personalDetails: {
    type: personalDetailsSchema,
    required: true,
  },
});

const Interested = models.Interested || model("Interested", interestedSchema);

export { Interested };