import { Request, Response } from 'express';
import Book from '../models/Book';

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genres, authors, minRating = 0 } = req.body as {
      genres?: string[];
      authors?: string[];
      minRating?: number;
    };

    const match: any = {};

    if (genres && genres.length > 0) {
      match.genre = { 
        $in: genres.map(genre => new RegExp(genre, 'i'))
      };
    }

    if (authors && authors.length > 0) {
      match.author = { 
        $in: authors.map(author => new RegExp(author, 'i'))
      };
    }

    if (typeof minRating === 'number' && minRating > 0) {
      match.rating = { $gte: minRating };
    }

    const pipeline: any[] = [
      { $match: match },
      { $sort: { rating: -1 } }
    ];

    const recommendations = await Book.aggregate(pipeline);

    if (recommendations.length === 0) {
      res.status(404).json({ message: 'No matching books found' });
      return;
    }

    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};