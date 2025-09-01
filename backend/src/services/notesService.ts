import Note, { INote } from '../models/Note';
import { Types } from 'mongoose';

export const createNote = async (title: string, content: string, userId: Types.ObjectId): Promise<INote> => {
  try {
    const note = await Note.create({
      title,
      content,
      userId,
    });
    
    return note;
  } catch (error) {
    throw new Error('Failed to create note');
  }
};

export const getNotesByUser = async (userId: Types.ObjectId): Promise<INote[]> => {
  try {
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    return notes;
  } catch (error) {
    throw new Error('Failed to fetch notes');
  }
};

export const getNoteById = async (noteId: string, userId: Types.ObjectId): Promise<INote | null> => {
  try {
    const note = await Note.findOne({ _id: noteId, userId });
    return note;
  } catch (error) {
    throw new Error('Failed to fetch note');
  }
};

export const updateNote = async (
  noteId: string, 
  userId: Types.ObjectId, 
  updates: { title?: string; content?: string }
): Promise<INote> => {
  try {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found or you do not have permission to update it');
    }
    
    if (updates.title !== undefined) {
      note.title = updates.title;
    }
    
    if (updates.content !== undefined) {
      note.content = updates.content;
    }
    
    await note.save();
    return note;
  } catch (error) {
    throw new Error('Failed to update note');
  }
};

export const deleteNote = async (noteId: string, userId: Types.ObjectId): Promise<void> => {
  try {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found or you do not have permission to delete it');
    }
    
    await Note.deleteOne({ _id: noteId });
  } catch (error) {
    throw new Error('Failed to delete note');
  }
};