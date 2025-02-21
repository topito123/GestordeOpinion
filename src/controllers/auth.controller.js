import User from '../models/User.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

dotenv.config();

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { username, email, password } = req.body;
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
        
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) return res.status(400).json({ message: 'Credenciales inválidas' });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ message: 'User not find'})

        const validPassword = await argon2.verify(user.password, oldPassword);
        if (!validPassword) return res.status(400).json ({message: 'Incorrect password'})

        user.password = await argon2.hash(newPassword);
        await user.save();

        res.json({ message: 'Password changed succesfuly'});
}catch (error) {
    res.status(500).json({ error: error.message });
}
}; 