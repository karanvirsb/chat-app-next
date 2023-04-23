import { IGroup } from "@/server/Features/group/group";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IGroupState {
  groups: IGroup[];
}

const initialState: IGroupState = {
  groups: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<IGroup>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
