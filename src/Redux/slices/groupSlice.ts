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
    setGroups(state, action: PayloadAction<IGroup[]>) {
      state.groups = action.payload;
    },
    setGroup(state, action: PayloadAction<IGroup>) {
      state.groups.push(action.payload);
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
