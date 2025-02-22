import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import argon2 from 'argon2';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Acceso denegado
 */
router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualiza el perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       500:
 *         description: Error del servidor
 */
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Cambia la contraseña del usuario
 *     tags: [Users]
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
 *       500:
 *         description: Error del servidor
 */
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { oldPassword, newPassword } = req.body;
        const validPassword = await argon2.verify(user.password, oldPassword);
        if (!validPassword) return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        
        user.password = await argon2.hash(newPassword);
        await user.save();
        res.json({ message: 'Contraseña actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;