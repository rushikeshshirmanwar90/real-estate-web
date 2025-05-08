import { model, models, Schema } from "mongoose";

const HeroSectionSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    buttonLink: {
        type: String,
        required: true,
    },
})

export const HeroSection = models.HeroSection || model("HeroSection", HeroSectionSchema);

