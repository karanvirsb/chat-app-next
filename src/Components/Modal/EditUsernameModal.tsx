import React, { useState } from "react";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

export default function EditUsernameModal() {
  const [newUsername, setNewUsername] = useState("");
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const [currPasswordErrorMsg, setCurrPasswordErrorMsg] = useState("");

  const dispatch = useAppDispatch();

  return (
    <Modal modalName="Change Username">
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
          inputId="username"
          labelName="New Username"
          errorMsg={usernameErrorMsg}
          onChange={handleUsernameChange}
          value={newUsername}
          placeholder="Enter Username"
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

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewUsername(() => e.target.value);
  }

  function handleCurrPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrPassword(() => e.target.value);
  }
  // TODO
  function handleSubmit() {}

  function handleCancel() {
    dispatch(resetModal());
  }
}
