import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import userRouter from "../routes/user.routes.js";
import messageRouter from "../routes/message.routes.js";
import chatRouter from "../routes/chat.routes.js";
import { initializeSocketIO } from "../socket/index.js";

const app = express();
dotenv.config({ path: "../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.join(__dirname, 'public');

// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));
// Serve static files from the 'public' directory
// app.use('/temp', express.static(path.join(staticDirectory, 'temp')));

// Create the HTTP server
const httpServer = createServer(app);

// Create the Socket.IO server
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chat-box-iota-gold.vercel.app",
    credentials: true,
  },
});

app.set("io", io);


const corsOptions = {
  origin: "https://chat-box-iota-gold.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat-app/message", messageRouter);
app.use("/api/v1/chat-app/chat", chatRouter);
initializeSocketIO(io);

export { httpServer };
export default app;
