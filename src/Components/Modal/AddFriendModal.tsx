import React, { useState } from "react";

import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

// TODO
export default function AddFriendModal() {
  const [friendsName, setFriendsName] = useState("");
  const dispatch = useAppDispatch();
  return (
    <Modal modalName="Add a Friend" modalClass="flex">
      <div className="flex flex-col flex-grow w-full gap-4 mt-6 justify-end">
        <ModalInput
          labelName="Username"
          onChange={handleChange}
          value={friendsName}
          placeholder="Group Name"
          inputId="friendsName"
          formClass="flex-grow"
        ></ModalInput>
        <div className="flex gap-4 mt-2">
          <BtnCallToAction text="Add" onClick={handleSubmit}></BtnCallToAction>
          <BtnCancelAction text="Cancel" onClick={closeModal}></BtnCancelAction>
        </div>
      </div>
    </Modal>
  );

  function closeModal() {
    dispatch(resetModal());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFriendsName(() => e.target.value);
  }

  function handleSubmit() {}
}
