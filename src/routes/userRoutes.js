import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get("/", protect, getAllUsers);

export default router;
