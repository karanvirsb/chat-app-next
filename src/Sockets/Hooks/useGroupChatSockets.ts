import socket from "..";
import { groupChatSocketEvents } from "../SocketHandler";

export default function useGroupChatSockets() {
  return (arg: groupChatSocketEvents) => {
    socket.emit(arg.event, arg.data);
  };
}
