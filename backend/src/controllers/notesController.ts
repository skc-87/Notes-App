import { Response } from 'express';
import { AuthRequest } from '../types';
import * as notesService from '../services/notesService';

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const note = await notesService.createNote(title, content, req.user._id);
    
    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const notes = await notesService.getNotesByUser(req.user._id);
    
    res.status(200).json({
      notes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const note = await notesService.getNoteById(id, req.user._id);
    
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    
    res.status(200).json({
      note,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    if (!title && !content) {
      res.status(400).json({ message: 'Please provide title or content to update' });
      return;
    }
    
    const note = await notesService.updateNote(id, req.user._id, { title, content });
    
    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    await notesService.deleteNote(id, req.user._id);
    
    res.status(200).json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};