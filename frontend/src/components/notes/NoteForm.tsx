import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { createNote, updateNote, fetchNotes } from '../../store/slices/notesSlice';
import { Note } from '../../types';
import Button from '../common/Button';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  noteToEdit?: Note | null;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ noteToEdit, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const isEditing = !!noteToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  }, [noteToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(updateNote({ id: noteToEdit._id, title, content }));
    } else {
      await dispatch(createNote({ title, content }));
    }
    dispatch(fetchNotes()); // Refetch all notes to ensure UI is in sync
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{isEditing ? 'Edit Note' : 'Create Note'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={10}
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Note'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;