import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  reconnectionAttempts: 2,
  closeOnBeforeunload: false,
  autoConnect: true,
  path: "/api/socket",
});

export default socket;
