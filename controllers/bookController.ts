import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookData: Partial<IBook> = req.body;
    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const totalBooks = await Book.countDocuments(); 
      const books = await Book.find()
        .limit(limit)
        .skip((page - 1) * limit);
      
      res.json({
        books,
        totalPages: Math.ceil(totalBooks / limit), 
        currentPage: page
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
