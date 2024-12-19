import { model, models, Schema } from "mongoose";

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      require: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },

    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Buildings",
      required: true,
    },

    flatId: {
      type: Schema.Types.ObjectId,
      ref: "Flats",
      require: true,
    },

    byOnline: {
      type: Boolean,
      require: false,
    },

    byBroker: {
      isBroker: {
        type: Boolean,
        require: true,
      },

      brokerDetails: {
        type: Schema.Types.ObjectId,
        ref: "Broker",
      },
    },

    byOther: {
      type: Boolean,
      message: {
        type: String,
      },
    },

    assignTo: {
      type: Schema.Types.ObjectId || null,
      default: null,
      ref: "sealsMan",
    },
  },
  { timestamps: true }
);

const Lead = models.Lead || model("Lead", leadSchema);

export { Lead };
