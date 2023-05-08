import React, { useEffect } from "react";

import { groupActions } from "@/Redux/group/groupSlice";

import { useDeleteGroupMessageMutation } from "../../Hooks/groupChatHooks";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import MutationModal from "./MutationModal";

type props = {
  messageId: string;
  groupId: string;
  pageIndex: number;
  messageIndex: number;
  channelId: string;
};

export default function DeleteMessageModal({
  messageId,
  groupId,
  messageIndex,
  pageIndex,
  channelId,
}: props) {
  const dispatch = useAppDispatch();
  const {
    mutate: deleteMessage,
    isLoading,
    isSuccess,
  } = useDeleteGroupMessageMutation({ groupId });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      handleCancel();
    }
  }, [isLoading, isSuccess]);

  return (
    <MutationModal
      btnCTAName="Yes"
      btnCancelName="No"
      modalName="Delete Message"
      text="Are you sure you want to delete the message?"
      loading={isLoading}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    ></MutationModal>
  );

  function handleCancel() {
    dispatch(resetModal());
  }

  function handleSubmit() {
    dispatch(
      groupActions.deleteMessage({
        groupId,
        payload: { channelId, messageId, pageIndex, messageIndex },
      })
    );
    // deleteMessage({ messageId, pageIndex, messageIndex: messageIndex });
  }
}
