import React, { useEffect } from "react";

import { useDeleteGroupMutation } from "../../Hooks/groupHooks";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import MutationModal from "./MutationModal";

type props = {
  groupId: string;
};

export default function DeleteGroupModal({ groupId }: props) {
  const dispatch = useAppDispatch();
  const {
    mutate: deleteGroup,
    isLoading,
    isSuccess,
  } = useDeleteGroupMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      handleCancel();
    }
  }, [isLoading, isSuccess]);

  return (
    <MutationModal
      btnCTAName="Yes"
      btnCancelName="No"
      modalName="Delete Group"
      text="Are you sure you want to delete the group?"
      loading={isLoading}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    ></MutationModal>
  );

  function handleSubmit() {
    deleteGroup({ groupId });
  }

  function handleCancel() {
    dispatch(resetModal());
  }
}
