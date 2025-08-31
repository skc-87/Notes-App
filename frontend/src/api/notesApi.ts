import api from './axios';
import { Note } from '../types';

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get<{ notes: Note[] }>('/notes');
  return response.data.notes;
};

export const createNote = async (data: {
  title: string;
  content: string;
}): Promise<Note> => {
  const response = await api.post<{ note: Note }>('/notes', data);
  return response.data.note;
};

export const updateNote = async (data: {
  id: string;
  title?: string;
  content?: string;
}): Promise<Note> => {
  const { id, ...updates } = data;
  const response = await api.put<{ note: Note }>(`/notes/${id}`, updates);
  return response.data.note;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};