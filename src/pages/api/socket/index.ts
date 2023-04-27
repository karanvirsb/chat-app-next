import { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { updateGroupUC } from "@/server/Features/group/updateGroup";
import { userEvents } from "@/server/sockets/events/user-events";
import { groupEvents } from "@/Sockets/events/group-events";
import { UpdateChannelsListEvent } from "@/Sockets/types/groupChannelTypes";
import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "@/Sockets/types/groupChatTypes";
import {
  DeleteEvent,
  LeaveGroupEvent,
  UpdateEvent,
  UpdateGroupUsersEvent,
} from "@/Sockets/types/groupTypes";
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
      socket.on("update_channel_lists", (data: UpdateChannelsListEvent) => {
        io.to(data.groupId).emit(
          "update_channel_list",
          data.payload.channelInfo
        );
      });

      // group chat events
      socket.on("create_group_message", (data: ICreateGroupMessageEvent) => {
        io.to(data.groupId).emit("new_group_chat_message", data);
      });

      socket.on("update_group_message", (data: IUpdateGroupMessageEvent) => {
        io.to(data.groupId).emit("update_group_chat_message", data);
      });

      socket.on("delete_group_message", (data: IDeleteGroupMessageEvent) => {
        io.to(data.groupId).emit("delete_group_chat_message", data);
      });
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
