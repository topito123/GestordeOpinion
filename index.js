import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerDocs from "./src/swagger/swagger.js"; // Ruta corregida
import authRoutes from "./src/routes/auth.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Documentación Swagger
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});