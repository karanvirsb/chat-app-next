import React from "react";
import ToggleSidebarBtn from "../../../Components/ToggleSidebarBtn/ToggleSidebarBtn";
import TopBarContainer from "../../../Components/TopBarContainer/TopBarContainer";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";

export default function MeTopBar() {
    const dispatch = useAppDispatch();
    return (
        <TopBarContainer>
            <div className='flex gap-4 items-center'>
                <ToggleSidebarBtn></ToggleSidebarBtn>
                {/* TODO Friends username goes here */}
                <span>Friends Name</span>
                <button
                    className='btn btn-sm border-none bg-accent-color font-bold ml-4 text-black hover:bg-accent-hover sm:hidden'
                    onClick={displayAddFriendModal}
                >
                    Add Friends
                </button>
            </div>
        </TopBarContainer>
    );

    function displayAddFriendModal() {
        dispatch(
            setModal({
                modalName: "addFriend",
                open: true,
                options: {},
            })
        );
    }
}
