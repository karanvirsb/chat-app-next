import { createServer } from "http";

import app from "../app";
import buildSockets from "./socket";
const httpServer = createServer(app);

const socketIo = buildSockets({ httpServer });
const io = socketIo();
app.set("socketIo", io);

export default httpServer;
