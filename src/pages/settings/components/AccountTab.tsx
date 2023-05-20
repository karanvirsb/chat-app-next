import React from "react";

import MenuBtn from "../../../Components/MenuBtn/MenuBtn";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";
import UserInput from "./UserInput";

// TODO add username, email, password info and edit btn
// TODO add delete account button
export default function AccountTab() {
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col gap-4 items-center w-full md:px-2">
      <div className="flex justify-start px-4 w-full">
        <MenuBtn></MenuBtn>
        <h1 className="font-semibold px-4 py-2 text-gray-600 text-lg text-left uppercase w-full">
          Account
        </h1>
      </div>
      <div className="bg-[hsl(220,18%,15%)] flex flex-col gap-4 items-center py-4 rounded-md min-w-[150px] m-md:w-[70%] max-w-[700px] md:w-full">
        <UserInput
          labelName="Username"
          value="username"
          onClick={displayEditUsernameModal}
        ></UserInput>
        <UserInput
          labelName="Email"
          value="Email"
          onClick={displayEditEmailModal}
        ></UserInput>
        <UserInput
          labelName="Password"
          value="password"
          inputType="password"
          onClick={displayEditPasswordModal}
        ></UserInput>
      </div>
      <div className="min-w-[150px] w-[70%] max-w-[700px] md:w-full">
        <button
          className="btn bg-btn-mutations border-none mt-6 text-btn-mutations-text hover:bg-btn-mutations-hover"
          onClick={displayDeleteAccountModal}
        >
          Delete Account
        </button>
      </div>
    </div>
  );

  function displayDeleteAccountModal() {
    dispatch(setModal({ modalName: "deleteAccount", open: true, options: {} }));
  }

  function displayEditUsernameModal() {
    dispatch(setModal({ modalName: "editUsername", open: true, options: {} }));
  }

  function displayEditEmailModal() {
    dispatch(setModal({ modalName: "editEmail", open: true, options: {} }));
  }

  function displayEditPasswordModal() {
    dispatch(setModal({ modalName: "editPassword", open: true, options: {} }));
  }
}
