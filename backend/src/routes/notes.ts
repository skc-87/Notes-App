import express from 'express';
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController';
import { validateNote, validateNoteUpdate, validateObjectId } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', validateNote, createNote);
router.get('/', getNotes);
router.get('/:id', validateObjectId('id'), getNote);
router.put('/:id', validateObjectId('id'), validateNoteUpdate, updateNote);
router.delete('/:id', validateObjectId('id'), deleteNote);

export default router;