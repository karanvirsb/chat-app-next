import socket from "..";
import { userSocketEvents } from "../SocketHandler";

export default function useLoginAndLogoutSockets() {
  return (arg: userSocketEvents) => {
    socket.emit(arg.event, arg.data);
  };
}
