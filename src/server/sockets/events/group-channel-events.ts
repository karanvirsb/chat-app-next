import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { createChannel } from "@/server/Features/groupChannel/use-cases";

import { UpdateChannelsListEvent } from "../types/groupChannel";

type props = {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

export function groupChannelEvents({ socket, io }: props) {
  socket.on("add_channel", async (data: UpdateChannelsListEvent) => {
    const result = await createChannel(data);
    if (result.success && result.data) {
      io.to(data.groupId).emit("add_new_channel", data);
    } else {
      socket.emit("add_new_channel_error", result.error);
    }
  });
}
