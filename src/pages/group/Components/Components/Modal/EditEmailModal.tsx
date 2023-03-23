import React, { useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

export default function EditEmailModal() {
    const [newEmail, setNewEmail] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");

    const [currPassword, setCurrPassword] = useState("");
    const [currPasswordErrorMsg, setCurrPasswordErrorMsg] = useState("");

    const dispatch = useAppDispatch();

    return (
        <Modal modalName='Change Email'>
            <div className='flex flex-col gap-4 mt-6'>
                <ModalInput
                    inputId='currPassword'
                    labelName='Current Password'
                    errorMsg={currPasswordErrorMsg}
                    onChange={handleCurrPasswordChange}
                    value={currPassword}
                    placeholder='Enter Current Password'
                ></ModalInput>
                <ModalInput
                    inputId='email'
                    labelName='New Email'
                    errorMsg={emailErrorMsg}
                    onChange={handleEmailChange}
                    value={newEmail}
                    placeholder='Enter New Email'
                ></ModalInput>
                <div className='flex gap-4 mt-2'>
                    <BtnCallToAction
                        onClick={handleSubmit}
                        text='Change'
                    ></BtnCallToAction>
                    <BtnCancelAction
                        onClick={handleCancel}
                        text='Cancel'
                    ></BtnCancelAction>
                </div>
            </div>
        </Modal>
    );

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewEmail(() => e.target.value);
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
