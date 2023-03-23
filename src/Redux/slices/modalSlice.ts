import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";

// Define a type for the slice state
export type ModalState =
  | {
      open: boolean;
      modalName: "changeGroupName";
      options: { groupId: string; previousName: string };
    }
  | { open: boolean; options: { inviteCode: string }; modalName: "inviteUser" }
  | { open: boolean; options: { groupId: string }; modalName: "deleteGroup" }
  | { open: boolean; options: { groupId: string }; modalName: "leaveGroup" }
  | { open: boolean; options: {}; modalName: "createGroup" }
  | { open: boolean; options: {}; modalName: "addFriend" }
  | { open: boolean; options: {}; modalName: "deleteAccount" }
  | { open: boolean; options: {}; modalName: "editUsername" }
  | { open: boolean; options: {}; modalName: "editEmail" }
  | { open: boolean; options: {}; modalName: "editPassword" }
  | { open: boolean; options: { inviteCode: string }; modalName: "joinGroup" }
  | {
      open: boolean;
      options: { groupId: string };
      modalName: "createGroupChannel";
    }
  | {
      open: boolean;
      options: {
        messageId: string;
        groupId: string;
        pageIndex: number;
        messageIndex: number;
      };
      modalName: "deleteGroupMessage";
    };

// Define the initial state using that type
const initialState: ModalState = {
  modalName: "createGroup",
  options: {},
  open: false,
};

export const modalSlice = createSlice({
  name: "modal",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState as ModalState,
  reducers: {
    setModal: (state, action: PayloadAction<ModalState>) => {
      const { modalName, options, open } = action.payload;
      state.modalName = modalName;
      state.open = open;
      state.options = options;
    },
    resetModal: (state) => {
      state.modalName = "createGroup";
      state.open = false;
      state.options = {};
    },
  },
});

export const { setModal, resetModal } = modalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectModalState = (state: RootState) => state.counter.value;

export default modalSlice.reducer;
