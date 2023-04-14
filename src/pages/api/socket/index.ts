import { Server, Socket } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "@/types/next";
const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any, { path: "/api/socket" });
    io.on("disconnect", () => {});
    io.on("connection", (socket) => {
      console.log("🚀 ~ file: index.ts:10 ~ io.on ~ socket:", socket);
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
