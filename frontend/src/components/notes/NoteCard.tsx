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
      <div className={styles.cardContent} onClick={() => onEdit(note)}>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
      </div>
      <div className={styles.cardActions}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          aria-label="Delete Note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NoteCard;