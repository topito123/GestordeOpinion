import { body } from "express-validator"

export const validateUserRegister = [
    body("username").notEmpty().withMessage("El nombre de usuario es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const validatePost = [
    body("title").notEmpty().withMessage("El título es obligatorio"),
    body("category").notEmpty().withMessage("La categoría es obligatoria"),
    body("content").notEmpty().withMessage("El contenido no puede estar vacío"),
];


export const validateComment = [
    body("text").notEmpty().withMessage("El comentario no puede estar vacío"),
];

