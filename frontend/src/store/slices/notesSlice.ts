import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../../types';
import * as notesApi from '../../api/notesApi';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', notesApi.getNotes);
export const createNote = createAsyncThunk('notes/createNote', notesApi.createNote);
export const updateNote = createAsyncThunk('notes/updateNote', notesApi.updateNote);
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string) => {
    await notesApi.deleteNote(id);
    return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.notes.unshift(action.payload);
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
            state.notes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.notes = state.notes.filter(note => note._id !== action.payload);
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('notes/') && action.type.endsWith('/rejected') && action.type !== 'notes/fetchNotes/rejected',
        (state, action: PayloadAction<string>) => {
          state.error = (action.payload as string) || 'An error occurred. Please try again.';
        }
      );
  },
});

export default notesSlice.reducer;