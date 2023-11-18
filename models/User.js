import mongoose from "mongoose";
const { Schema, model} = mongoose;

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
  events: [
    { type: Schema.Types.ObjectId, ref: "Event" },
  ] /* List of events ids */,
});

export default model("User", userSchema);
  