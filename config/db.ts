import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:eJy8EBakpbhp1FE4@SG-catkin-peony-3313-71256.servers.mongodirector.com:27017/admin';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as mongoose.ConnectOptions);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
