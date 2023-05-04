export const groupChatEventsTypes = {
  NEW_MESSAGE: {
    send: "create_group_message",
    broadcast: "new_group_chat_message",
    error: "new_group_chat_message_error",
  },
  UPDATE_MESSAGE: {
    send: "update_group_message",
    broadcast: "update_group_chat_message",
    error: "update_group_chat_message_error",
  },
  DELETE_MESSAGE: {
    send: "delete_group_message",
    broadcast: "delete_group_chat_message",
    error: "delete_group_chat_message_error",
  },
};