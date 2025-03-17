import User from "../models/User.js";

// ➡️ Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclure le mot de passe
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
