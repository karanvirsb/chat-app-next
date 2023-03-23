import React, { useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { resetModal } from "../../Redux/slices/modalSlice";
import BtnCallToAction from "../Buttons/BtnCallToAction";
import BtnCancelAction from "../Buttons/BtnCancelAction";
import CopiedPopUp from "../CopiedPopUp/CopiedPopUp";
import ModalInput from "../Inputs/ModalInput";
import Modal from "./Modal";

type props = {
    inviteCode: string;
};

export default function InviteUserModal({ inviteCode }: props) {
    const [usernameSearch, setUsernameSearch] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [copied, setCopied] = useState(false);

    const dispatch = useAppDispatch();
    // TODO useEffect that checks user name in database

    const url = `http://localhost:3000/invite/${inviteCode}`;
    return (
        <>
            <Modal modalName='Invite User'>
                <div className='flex flex-col gap-4 mt-6'>
                    {/* TODO add invite url */}
                    <ModalInput
                        inputId='inviteCode'
                        labelName='Invite Code'
                        editable={false}
                        value={url}
                        formClass='items-baseline'
                        inputClass='mb-6'
                    >
                        <BtnCallToAction
                            text='Copy'
                            onClick={handleCopyInviteCode}
                        ></BtnCallToAction>
                    </ModalInput>
                    <ModalInput
                        inputId='inviteUserSearch'
                        labelName='Invite User'
                        type='search'
                        placeholder='Search User'
                        value={usernameSearch}
                        onChange={handleUserSearch}
                        errorMsg={errorMsg}
                    ></ModalInput>
                    <div className='flex gap-4 mt-2'>
                        <BtnCallToAction
                            onClick={handleSubmit}
                            text='Send'
                        ></BtnCallToAction>
                        <BtnCancelAction
                            onClick={handleCancel}
                            text='Cancel'
                        ></BtnCancelAction>
                    </div>
                </div>
            </Modal>
            <CopiedPopUp copied={copied} setCopied={setCopied}></CopiedPopUp>
        </>
    );

    function handleCopyInviteCode() {
        navigator.clipboard.writeText(url);
        setCopied(true);
    }

    function handleUserSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setUsernameSearch(() => e.target.value);
    }

    function handleSubmit() {
        if (!usernameSearch) {
            setErrorMsg("Type a username between 3 to 50 characters");
        }
    }

    function handleCancel() {
        dispatch(resetModal());
    }
}
