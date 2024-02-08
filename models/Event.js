import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    subcategories: [{type: String}],
    description: {type: String, required: true},
    location: {type: String, required: true},
    address: {type: String, required: true},
    date: {type: Date},
    dates: [{type: Date}],
    period: {type: Boolean},
    img: {type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User" }
});


export default model("Event", eventSchema)