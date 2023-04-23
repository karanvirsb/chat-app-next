import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGroup } from "@/server/Features/group/group";
import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";

interface IGroupState {
  groups: IGroup[];
  channels: IGroupChannel[];
}

const initialState: IGroupState = {
  groups: [],
  channels: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<IGroup[]>) {
      state.groups = action.payload;
    },
    addGroup(state, action: PayloadAction<IGroup>) {
      state.groups.push(action.payload);
    },
    setChannels(state, action: PayloadAction<IGroupChannel[]>) {
      state.channels = action.payload;
    },
    addChannel(state, action: PayloadAction<IGroupChannel>) {
      state.channels.push(action.payload);
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
