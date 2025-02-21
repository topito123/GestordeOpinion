import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import argon2 from 'argon2';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

