import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGroup } from "@/server/Features/group/group";
import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";

export interface IGroupState {
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
    updateGroup(
      state,
      action: PayloadAction<{
        groupId: string;
        group_updates: Partial<Omit<IGroup, "groupId" | "dateCreated">>;
      }>
    ) {
      return;
    },
    deleteGroup(state, action: PayloadAction<{ groupId: string }>) {
      return;
    },
    setChannels(state, action: PayloadAction<IGroupChannel[]>) {
      state.channels = action.payload;
    },
    addChannel(
      state,
      action: PayloadAction<{
        channel: Pick<IGroupChannel, "groupId" | "channelName">;
      }>
    ) {
      return;
      // state.channels.push(action.payload.channel);
    },
    deleteChannel(
      state,
      action: PayloadAction<{ channelId: string; groupId: string }>
    ) {
      return;
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
