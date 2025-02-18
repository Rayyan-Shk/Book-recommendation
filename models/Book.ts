import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author?: string;
  genre?: string;
  rating?: number;
  reviews?: string[];
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String },
  genre: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: [String], default: [] }
});

BookSchema.index({ genre: 1, author: 1, rating: -1 });

export default model<IBook>('Book', BookSchema);
