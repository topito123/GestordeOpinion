import express from 'express';
import { body } from 'express-validator';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validatePost } from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crea una nueva publicación
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', authMiddleware, [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
    body('content').notEmpty().withMessage('El contenido es obligatorio')
], createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtiene todas las publicaciones
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 */
router.get('/', getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtiene una publicación por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *       404:
 *         description: Publicación no encontrada
 */
router.get('/:id', getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Actualiza una publicación por ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publicación actualizada
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No autorizado
 */
router.put('/:id', authMiddleware, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Elimina una publicación por ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada correctamente
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No autorizado
 */
router.delete('/:id', authMiddleware, deletePost);

export default router;