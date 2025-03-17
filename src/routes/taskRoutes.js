import express from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes CRUD protégées
router.post("/", protect, createTask);         // Créer une tâche
router.get("/", protect, getTasks);            // Récupérer toutes les tâches de l'utilisateur
router.get("/:id", protect, getTaskById);      // Récupérer une tâche par ID
router.put("/:id", protect, updateTask);       // Mettre à jour une tâche
router.delete("/:id", protect, deleteTask);    // Supprimer une tâche

export default router;
