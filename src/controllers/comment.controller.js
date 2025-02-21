import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { validationResult } from 'express-validator';

export const createComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { content, postId } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        
        const newComment = new Comment({ content, post: postId, user: req.user.id });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username email');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
        if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });
        
        comment.content = content || comment.content;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
        if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });
        
        await comment.deleteOne({ _id: req.params.id });
        res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

