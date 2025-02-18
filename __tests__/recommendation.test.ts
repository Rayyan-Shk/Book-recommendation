import { Request, Response } from 'express';
import { getRecommendations } from '../controllers/recommendationController';
import Book from '../models/Book';

jest.mock('../models/Book', () => ({
  aggregate: jest.fn()
}));

describe('getRecommendations Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    req = {
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    jest.clearAllMocks();
  });

  test('should return recommendations when books found', async () => {
    const mockBooks = [
      { title: 'Book 1', author: 'Author 1', genre: 'Fiction', rating: 4.5 }
    ];
    req.body = { genres: ['Fiction'], minRating: 4 };
    
    (Book.aggregate as jest.Mock).mockResolvedValue(mockBooks);
  
    await getRecommendations(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  test('should return 404 when no books found', async () => {

    req.body = { genres: ['NonExistentGenre'] };
    
   
    (Book.aggregate as jest.Mock).mockResolvedValue([]);
    
  
    await getRecommendations(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No matching books found' });
  });

  test('should handle errors', async () => {
    req.body = { genres: ['Fiction'] };
  
    const error = new Error('Database error');
    (Book.aggregate as jest.Mock).mockRejectedValue(error);
  
    await getRecommendations(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});