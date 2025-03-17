import express from "express";
import { getTaskStats } from "../controllers/statsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour les statistiques des tâches
router.get("/", protect, getTaskStats);

export default router;
