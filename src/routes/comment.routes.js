import express from 'express';
import { body } from 'express-validator';
import { createComment, getCommentsByPost, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateComment } from "../utils/validators.js";

const router = express.Router();

router.post('/', authMiddleware, [
    body('content').notEmpty().withMessage('El contenido no puede estar vacío'),
    body('postId').notEmpty().withMessage('Se requiere el ID de la publicación')
], createComment);

router.get('/:postId', getCommentsByPost);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;