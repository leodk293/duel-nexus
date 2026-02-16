import mongoose, { Schema, models } from "mongoose";

const cardSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        race: {
            type: String,
            required: true,
        },
        type: {
            type: Array,
            required: true,
        },
        attribute: {
            type: Number,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        archetype: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Card = models.Card || mongoose.model("Card", cardSchema);

export default Card;
