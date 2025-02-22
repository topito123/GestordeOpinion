import express from 'express';
import { register, login, changePassword } from '../controllers/auth.controller.js';
import { validateUserRegister } from "../utils/validators.js";
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/register', [
    body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
], login);

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     summary: Cambia la contraseña del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña actual incorrecta
 */
router.put('/password', authMiddleware, changePassword);

export default router;