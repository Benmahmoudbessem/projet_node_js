import Task from "../models/Task.js";
import mongoose from "mongoose";

// ➡️ Récupérer les statistiques des tâches avec filtres
export const getTaskStats = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;

        // Construire le filtre de date
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Construire le filtre pour l'utilisateur
        const userFilter = userId ? { user: mongoose.Types.ObjectId(userId) } : {};

        // Récupérer les statistiques
        const stats = await Task.aggregate([
            {
                $match: {
                    ...userFilter,
                    ...dateFilter,
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
