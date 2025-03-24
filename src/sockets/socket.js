import { Server } from "socket.io";
import http from "http";
import app from "./server.js"; // Assure-toi d'importer ton serveur Express

const server = http.createServer(app);
const io = new Server(server);

export { io, server };
