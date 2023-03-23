import React from "react";
import SidebarInfo from "../../../Components/SidebarInfo/SidebarInfo";

// TODO gather user id and then map through friends list
export default function MeSideBarInfo() {
    return (
        <SidebarInfo>
            <>
                <h1 className='bg-groupInfo-bg border-b border-chat-bg flex items-center font-semibold drop-shadow-md py-2 px-4 w-full h-16 text-white'>
                    Friends
                </h1>
                <div className='bg-groupInfo-bg flex-grow text-white'>
                    {/* TODO make a user component */}
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </>
        </SidebarInfo>
    );
}
