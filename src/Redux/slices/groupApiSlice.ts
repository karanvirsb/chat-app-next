export {};
// // Import the RTK Query methods from the React-specific entry point
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import socket from "../../Sockets";

// export interface IGroup {
//     groupName: string;
//     groupId: string;
//     inviteCode: string;
//     dateCreated: Date;
// }

// export interface IUser {
//     userId: string;
//     username: string;
//     email: string;
//     status: string;
//     time_joined: Date;
// }

// export type returnGroupsData = {
//     success: boolean;
//     data: IGroup[] | undefined;
//     error: string;
// };

// export type returnGroupData = {
//     success: boolean;
//     data: IGroup | undefined;
//     error: string;
// };

// export type returnGroupUserData = {
//     success: boolean;
//     data: IUser[] | undefined;
//     error: string;
// };

// export type groupUsers = {
//     gId: string;
//     uId: string;
//     roles: number[];
// };

// export type returnAddGroupUserData = {
//     success: boolean;
//     data: groupUsers | undefined;
//     error: string;
// };

// export const groupApiSlice = createApi({
//     reducerPath: "groups",
//     baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
//     tagTypes: ["Groups", "Group", "GroupUsers"],
//     endpoints: (builder) => ({
//         getGroups: builder.query<IGroup[] | string, string | undefined>({
//             query: (userId) => {
//                 return { url: `/group/userId/${userId}` };
//             },
//             transformResponse: (response: returnGroupsData) => {
//                 if (response.success && response.data !== undefined) {
//                     return response.data;
//                 } else {
//                     return response.error;
//                 }
//             },
//             providesTags: ["Groups"],
//         }),
//         getGroup: builder.query<IGroup | string, string>({
//             query: (groupId: string) => ({
//                 url: `/group/${groupId}`,
//                 method: "GET",
//             }),
//             transformResponse: (response: returnGroupData) => {
//                 if (response.success && response.data) {
//                     return response.data;
//                 }
//                 return response.error;
//             },
//             providesTags: ["Group"],
//         }),
//         getGroupByInviteCode: builder.query<IGroup | string, string>({
//             query: (invite: string) => ({
//                 url: `/group/invite/${invite}`,
//                 method: "GET",
//             }),
//             transformResponse: (response: returnGroupData) => {
//                 if (response.success && response.data) {
//                     return response.data;
//                 }
//                 return response.error;
//             },
//             providesTags: ["Group"],
//         }),
//         createGroup: builder.mutation<
//             returnGroupData,
//             { groupInfo: Partial<IGroup>; userId: string }
//         >({
//             query: ({
//                 groupInfo,
//                 userId,
//             }: {
//                 groupInfo: Partial<IGroup>;
//                 userId: string;
//             }) => ({
//                 url: `/group`,
//                 method: "POST",
//                 body: {
//                     groupInfo,
//                     userId,
//                 },
//             }),
//             invalidatesTags: ["Groups"],
//         }),
//         getGroupUsers: builder.query<IUser[] | string, string>({
//             query: (groupId: string) => ({
//                 url: `/group/users/${groupId}`,
//                 method: "GET",
//             }),
//             transformResponse: (response: returnGroupUserData) => {
//                 if (response.success && response.data) {
//                     return response.data;
//                 } else {
//                     return response.error;
//                 }
//             },
//             providesTags: ["GroupUsers"],
//         }),
//         updateGroupName: builder.mutation<
//             returnGroupData,
//             { groupId: string; newName: string }
//         >({
//             query: ({
//                 groupId,
//                 newName,
//             }: {
//                 groupId: string;
//                 newName: string;
//             }) => ({
//                 url: "/group/name",
//                 method: "PUT",
//                 body: { groupId, newGroupName: newName },
//             }),
//             async onQueryStarted({}, { queryFulfilled }) {
//                 try {
//                     // checking if the query has been fullfilled
//                     const { data: updatedGroup } = await queryFulfilled;

//                     // if successful emit an event to update else to display error
//                     if (
//                         updatedGroup.success &&
//                         updatedGroup.data !== undefined
//                     ) {
//                         socket.emit("update_the_group_name", updatedGroup.data);
//                     } else {
//                         socket.emit("error_occurred", updatedGroup.error);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             },
//             async onCacheEntryAdded(arg, { dispatch }) {
//                 // create a websocket connection when the cache subscription starts

//                 try {
//                     // when data is received from the socket connection to the server,
//                     // if it is a message and for the appropriate channel,
//                     // update our query result with the received message
//                     const listener = (event: MessageEvent) => {
//                         dispatch(groupApiSlice.util.invalidateTags(["Groups"]));

//                         // socket.off("update_group_name"); // clean up
//                     };

//                     socket.on("update_group_name", listener);
//                 } catch (err) {
//                     console.error(err);
//                 }
//             },
//         }),
//         deleteGroup: builder.mutation({
//             query: (groupId: string) => ({
//                 url: "/group",
//                 method: "DELETE",
//                 body: { groupId },
//             }),
//             async onQueryStarted({}, { queryFulfilled }) {
//                 try {
//                     // checking if the query has been fullfilled
//                     const { data: deletedGroup } = await queryFulfilled;

//                     // if successful emit an event to delete the group else to display error
//                     if (
//                         deletedGroup.success &&
//                         deletedGroup.data !== undefined
//                     ) {
//                         socket.emit("delete_the_group", deletedGroup.data);
//                     } else {
//                         socket.emit("error_occurred", deletedGroup.error);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             },
//             async onCacheEntryAdded(arg, { dispatch }) {
//                 try {
//                     const listener = (event: MessageEvent) => {
//                         dispatch(
//                             groupApiSlice.util.invalidateTags(["Groups"])

//                             // TODO for anyone in the group show a modal message
//                             // TODO check if group is visible then show modal
//                         );

//                         // socket.off("delete_group"); // clean up
//                     };

//                     socket.on("delete_group", listener);
//                 } catch (err) {
//                     console.error(err);
//                 }
//             },
//         }),
//         addUserToGroup: builder.mutation<
//             returnAddGroupUserData,
//             {
//                 userId: string;
//                 groupId: string;
//             }
//         >({
//             query: ({
//                 userId,
//                 groupId,
//             }: {
//                 userId: string;
//                 groupId: string;
//             }) => ({
//                 url: "/group/user",
//                 method: "POST",
//                 body: {
//                     userId,
//                     groupId,
//                 },
//             }),
//             async onQueryStarted({}, { queryFulfilled, dispatch }) {
//                 try {
//                     // checking if the query has been fullfilled
//                     const { data: addedUser } = await queryFulfilled;

//                     dispatch(groupApiSlice.util.invalidateTags(["Groups"])); // making the user who joined reload their groups
//                     // if successful emit an event to add user to group else to display error
//                     if (addedUser.success && addedUser.data !== undefined) {
//                         socket.emit("join_rooms", {
//                             rooms: [addedUser.data.gId],
//                             userId: addedUser.data.uId,
//                         });
//                         socket.emit("added_user_to_group", addedUser.data);
//                     } else {
//                         socket.emit("error_occurred", addedUser.error);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             },
//             async onCacheEntryAdded(
//                 arg,
//                 { dispatch, cacheDataLoaded, cacheEntryRemoved }
//             ) {
//                 await cacheDataLoaded;
//                 try {
//                     const listener = (event: MessageEvent) => {
//                         console.log(
//                             "🚀 ~ file: groupApiSlice.ts ~ line 264 ~ listener ~ listener",
//                             event
//                         );
//                         dispatch(
//                             groupApiSlice.util.invalidateTags(["GroupUsers"])
//                         );
//                     };

//                     socket.on("added_user", listener);
//                 } catch (err) {
//                     console.error(err);
//                 }
//                 await cacheEntryRemoved;
//                 // socket.off("added_user"); // clean up
//             },
//         }),
//         leaveGroup: builder.mutation<
//             returnGroupUserData,
//             {
//                 userId: string;
//                 groupId: string;
//             }
//         >({
//             query: ({
//                 userId,
//                 groupId,
//             }: {
//                 userId: string;
//                 groupId: string;
//             }) => ({
//                 url: "/group/user",
//                 method: "DELETE",
//                 body: {
//                     userId,
//                     groupId,
//                 },
//             }),
//             async onQueryStarted({}, { queryFulfilled, dispatch }) {
//                 try {
//                     // checking if the query has been fullfilled
//                     const { data: deletedUser } = await queryFulfilled;

//                     // if successful emit an event to add user to group else to display error
//                     if (deletedUser.success && deletedUser.data !== undefined) {
//                         socket.emit(
//                             "removed_user_from_group",
//                             deletedUser.data
//                         );
//                     } else {
//                         socket.emit("error_occurred", deletedUser.error);
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             },
//             async onCacheEntryAdded(arg, { dispatch }) {
//                 dispatch(groupApiSlice.util.invalidateTags(["Groups"])); // making the user who joined reload their groups
//                 try {
//                     const listener = (event: any) => {
//                         const data: groupUsers = event;
//                         console.log(
//                             "🚀 ~ file: groupApiSlice.ts ~ line 319 ~ listener ~ listener",
//                             event,
//                             arg
//                         );

//                         dispatch(
//                             groupApiSlice.util.invalidateTags(["GroupUsers"])
//                         );
//                         // socket.off("removed_user", listener); // clean up
//                     };

//                     socket.on("removed_user", listener);
//                 } catch (err) {
//                     console.error(err);
//                 }
//             },
//         }),
//     }),
// });

// export const {
//     useGetGroupsQuery,
//     useCreateGroupMutation,
//     useGetGroupQuery,
//     useGetGroupByInviteCodeQuery,
//     useGetGroupUsersQuery,
//     useUpdateGroupNameMutation,
//     useDeleteGroupMutation,
//     useAddUserToGroupMutation,
//     useLeaveGroupMutation,
// } = groupApiSlice;
