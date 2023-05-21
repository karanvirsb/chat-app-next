import React from "react";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import MutationModal from "./MutationModal";

export default function DeleteAccountModal() {
  const dispatch = useAppDispatch();
  return (
    <MutationModal
      btnCTAName="Yes"
      btnCancelName="No"
      modalName="Delete Account"
      text="Are you sure you want to delete your account? You will not be able to recover it."
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    ></MutationModal>
  );

  // TODO handle deleting account
  function handleSubmit() {
    alert("implement this delete account modal");
  }

  function handleCancel() {
    dispatch(resetModal());
  }
}
