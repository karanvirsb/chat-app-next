import React, { useEffect } from "react";

import { useDeleteGroupMessageMutation } from "../../Hooks/groupChatHooks";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import MutationModal from "./MutationModal";

type props = {
  messageId: string;
  groupId: string;
  pageIndex: number;
  messageIndex: number;
};

export default function DeleteMessageModal({
  messageId,
  groupId,
  messageIndex,
  pageIndex,
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
    deleteMessage({ messageId, pageIndex, messageIndex: messageIndex });
  }
}
