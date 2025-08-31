import React from 'react';
import { Note } from '../../types';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className={styles.noteCard}>
      <div className={styles.cardContent}>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
      </div>
      <div className={styles.cardActions}>
        <button onClick={() => onEdit(note)} className={styles.actionButton}>
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;