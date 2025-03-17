import Task from "../models/Task.js";

// ➡️ Créer une nouvelle tâche
export const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const task = new Task({
            title,
            description,
            status,
            user: req.user._id,
        });
        const createdTask = await task.save();

        // 🔔 Notification en temps réel
        req.io.emit("taskCreated", createdTask);

        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➡️ Récupérer toutes les tâches de l'utilisateur
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➡️ Récupérer une tâche spécifique par ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.user.toString() === req.user._id.toString()) {
            res.json(task);
        } else {
            res.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➡️ Mettre à jour une tâche existante
export const updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.user.toString() === req.user._id.toString()) {
            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            const updatedTask = await task.save();

            // 🔔 Notification en temps réel
            req.io.emit("taskUpdated", updatedTask);

            res.json(updatedTask);
        } else {
            res.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➡️ Supprimer une tâche
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.user.toString() === req.user._id.toString()) {
            await task.remove();

            // 🔔 Notification en temps réel
            req.io.emit("taskDeleted", { id: task._id });

            
            res.json({ message: "Tâche supprimée avec succès" });
        } else {
            res.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
