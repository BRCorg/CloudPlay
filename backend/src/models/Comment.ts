//------------------ Model Commentaire ------------------//
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId; // Référence à l'utilisateur
  post: mongoose.Types.ObjectId; // Référence au post
  likes: mongoose.Types.ObjectId[]; // Références aux utilisateurs qui ont liké le commentaire
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>('Comment', commentSchema);