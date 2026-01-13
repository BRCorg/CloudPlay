//------------------ Model Post ------------------//
import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // URL de l'image uploadée
    author: { type: Types.ObjectId, ref: "User", required: true }, // référence au User
  },
  { timestamps: true }
);

export const Post = model("Post", postSchema);
