import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application et du serveur HTTP
const app = express();
const server = http.createServer(app);
// Obtenir le répertoire actuel de manière compatible avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Route des statistiques
app.use("/api/stats", statsRoutes);
// Servir des fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/users", userRoutes);

// Vérification et connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ Erreur : MONGO_URI non défini dans le fichier .env !");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connecté à MongoDB");
    })
    .catch((err) => {
        console.error("❌ Erreur de connexion MongoDB :", err);
    });

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
    console.log("🔌 Un utilisateur est connecté", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Utilisateur déconnecté", socket.id);
    });
});

// Middleware pour partager io
app.use((req, res, next) => {
    req.io = io;
    next();
});


// Route de test
app.get("/", (req, res) => {
    res.send("API de Gestion des Tâches 🚀");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

connectDB();
