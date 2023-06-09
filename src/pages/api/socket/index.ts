import { NextApiRequest } from "next";
import { Server } from "socket.io";

import { groupChannelEvents } from "@/server/sockets/events/group-channel-events";
import { groupChatEvents } from "@/server/sockets/events/group-chat-events";
import { groupEvents } from "@/server/sockets/events/group-events";
import { userEvents } from "@/server/sockets/events/user-events";
import { NextApiResponseServerIO } from "@/types/next";

const chatRooms = new Map<string, Set<string>>();

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("*** SETTING UP SOCKET SERVER ***");
    const io = new Server(res.socket.server as any, { path: "/api/socket" });
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("🚀 ~ file: index.ts:10 ~ io.on ~ sockets:", socket.id);
      // socket.on("ping", () => {
      //   clearTimeout(droppedConnectionTimeout);
      //   setCheckDroppedConnection(socket, droppedConnectionTimeout, io);
      // });

      // USER EVENTS
      // makes the socket join all the rooms
      userEvents({ socket, io });

      // GROUP EVENTS
      // when the update is successful
      groupEvents({ socket, io });

      // group channel events
      groupChannelEvents({ socket, io });

      // group chat events
      groupChatEvents({ socket, io });
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
