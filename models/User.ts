import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  preferences?: {
    genres?: string[];
    authors?: string[];
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String },
  preferences: {
    genres: { type: [String], default: [] },
    authors: { type: [String], default: [] }
  }
});

export default model<IUser>('User', UserSchema);
