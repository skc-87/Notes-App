import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchNotes, deleteNote } from '../../store/slices/notesSlice';
import { useAuth } from '../../hooks/useAuth';
import { Note } from '../../types';

import styles from './Dashboard.module.css';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotesList from '../../components/notes/NotesList';
import NoteForm from '../../components/notes/NoteForm';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { notes, isLoading } = useSelector((state: RootState) => state.notes);

  // State to manage the NoteForm modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateNoteClick = () => {
    setNoteToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditNoteClick = (note: Note) => {
    setNoteToEdit(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setNoteToEdit(null);
  };

  return (
    <>
      {isFormOpen && <NoteForm noteToEdit={noteToEdit} onClose={handleCloseForm} />}
      
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>HD Notes</div>
          <button onClick={handleLogout} className={styles.signOutButton}>
            Sign Out
          </button>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.welcomeCard}>
            <h2>Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
          </div>

          <div className={styles.notesSection}>
            <div className={styles.notesHeader}>
              <h2>Notes</h2>
              <Button onClick={handleCreateNoteClick}>Create Note</Button>
            </div>

            {isLoading && <div className={styles.centered}><LoadingSpinner /></div>}
            
            {!isLoading && notes.length === 0 && (
              <div className={styles.centered}><p>No notes found. Create your first one!</p></div>
            )}

            {!isLoading && notes.length > 0 && (
              <NotesList 
                notes={notes} 
                onEdit={handleEditNoteClick} 
                onDelete={handleDeleteNote}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;