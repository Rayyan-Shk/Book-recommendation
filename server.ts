import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

import bookRoutes from './routes/books';
import recommendationRoutes from './routes/recommendations';

const app: Application = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/books', bookRoutes);
app.use('/recommendations', recommendationRoutes);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookDB';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
