import Post from '../models/post.js';
import { validationResult } from 'express-validator';

export const createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { title, category, content } = req.body;
        const newPost = new Post({ title, category, content, user: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username email');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username email');
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });
        
        post.title = title || post.title;
        post.category = category || post.category;
        post.content = content || post.content;
        
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });
        
        await post.deleteOne({ _id: req.params.id });
        res.json({ message: 'Publicación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
