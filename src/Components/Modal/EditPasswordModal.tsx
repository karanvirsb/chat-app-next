import React, { useState } from "react";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

export default function EditPasswordModal() {
  const [newPassword, setNewPassword] = useState("");
  const [newPassErrorMsg, setNewPassErrorMsg] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassErrorMsg, setConfirmPassErrorMsg] = useState("");

  const [currPassword, setCurrPassword] = useState("");
  const [currPasswordErrorMsg, setCurrPasswordErrorMsg] = useState("");

  const dispatch = useAppDispatch();

  return (
    <Modal modalName="Change Password">
      <div className="flex flex-col gap-4 mt-6">
        <ModalInput
          inputId="currPassword"
          labelName="Current Password"
          errorMsg={currPasswordErrorMsg}
          onChange={handleCurrPasswordChange}
          value={currPassword}
          placeholder="Enter Current Password"
        ></ModalInput>
        <ModalInput
          inputId="password"
          labelName="New Password"
          errorMsg={newPassErrorMsg}
          onChange={handlePasswordChange}
          value={newPassword}
          placeholder="Enter New Password"
        ></ModalInput>
        <ModalInput
          inputId="confirmPassword"
          labelName="Confirm Password"
          errorMsg={confirmPassErrorMsg}
          onChange={handleConfirmPasswordChange}
          value={confirmPassword}
          placeholder="Enter New Password"
        ></ModalInput>
        <div className="flex gap-4 mt-2">
          <BtnCallToAction
            onClick={handleSubmit}
            text="Change"
          ></BtnCallToAction>
          <BtnCancelAction
            onClick={handleCancel}
            text="Cancel"
          ></BtnCancelAction>
        </div>
      </div>
    </Modal>
  );

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(() => e.target.value);
  }

  function handleCurrPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrPassword(() => e.target.value);
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(() => e.target.value);
  }

  function handleSubmit() {}

  function handleCancel() {
    dispatch(resetModal());
  }
}
