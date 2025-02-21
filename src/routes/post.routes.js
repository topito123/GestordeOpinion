import express from 'express';
import { body } from 'express-validator';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/', authMiddleware, [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
    body('content').notEmpty().withMessage('El contenido es obligatorio')
], createPost);

router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
