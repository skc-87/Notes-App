import React from 'react';
import { Note } from '../../types';
import NoteCard from './NoteCard';
import styles from './NotesList.module.css';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className={styles.notesGrid}>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotesList;