import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
type sideBarState = {
  open: boolean;
};

// Define the initial state using that type
const initialState: sideBarState = {
  open: true,
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSideBarOpen: (state) => {
      state.open = true;
    },
    setSideBarClosed: (state) => {
      state.open = false;
    },
  },
});

export const { setSideBarOpen, setSideBarClosed } = sideBarSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default sideBarSlice.reducer;
