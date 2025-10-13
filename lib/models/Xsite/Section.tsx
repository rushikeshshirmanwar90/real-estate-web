import { model, models, Schema } from "mongoose";

const SectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    projectDetails: {
        projectName: {
            type: String,
            required: true,
            trim: true
        },
        projectId: {
            type: String,
            required: true,
            trim: true
        }
    },

    mainSectionDetails: {
        sectionName: {
            type: String,
            required: false,
            trim: true
        },
        sectionId: {
            type: String,
            required: false,
            trim: true
        }
    }

}, { timestamps: true })

export const Section = models.Section || model("Section", SectionSchema)