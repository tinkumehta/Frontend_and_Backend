// routes/contentRoutes.js
import express from 'express';
import { generateContent, getContentHistory, deleteContent } from '../controllers/contentController.js';

const router = express.Router();

router.post('/generate', generateContent);
router.get('/history', getContentHistory);
router.delete('/:id', deleteContent);
export default router;
