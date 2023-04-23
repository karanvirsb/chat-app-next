import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import Spinner from "@/Components/Spinner/Spinner";
import { useAppDispatch } from "@/Hooks/reduxHooks";
import { setModal } from "@/Redux/slices/modalSlice";

function Invite() {
  const { data: sessionInfo } = useSession();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  // get the location from
  const router = useRouter();
  // if user is logged in send the invite code to the modal
  useEffect(() => {
    if (sessionInfo?.user) {
      router.push(`/me`); // either navigate home and send open modal for join group
      dispatch(
        setModal({
          open: true,
          modalName: "joinGroup",
          options: { inviteCode: params.get("inviteCode") ?? "" },
        })
      );
    }
  }, [sessionInfo]);
  // if user is not logged in log in and then send to invite code modal
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Spinner></Spinner>
    </div>
  );
}

export default Invite;
