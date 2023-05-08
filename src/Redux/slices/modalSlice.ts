import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
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
  | { open: boolean; options: object; modalName: "createGroup" }
  | { open: boolean; options: object; modalName: "addFriend" }
  | { open: boolean; options: object; modalName: "deleteAccount" }
  | { open: boolean; options: object; modalName: "editUsername" }
  | { open: boolean; options: object; modalName: "editEmail" }
  | { open: boolean; options: object; modalName: "editPassword" }
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
        channelId: string;
      };
      modalName: "deleteGroupMessage";
    }
  | {
      open: boolean;
      options: {
        channelId: string;
        groupId: string;
      };
      modalName: "deleteGroupChannel";
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
