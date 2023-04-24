// create a slice for socket
import { createSlice } from "@reduxjs/toolkit";

interface SocketState {
  connected: boolean;
}

const initialState: SocketState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected(state) {
      state.connected = true;
      console.log(
        "🚀 ~ file: socketSlice.ts:18 ~ setConnected ~ state.connected:",
        state.connected
      );
    },
  },
});
export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
