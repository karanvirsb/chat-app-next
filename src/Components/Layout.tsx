import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GroupSidebarInfo from "@/pages/group/Components/GroupSidebarInfo";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/Hooks/reduxHooks";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/api/auth/signin");
    },
  });
  const [selectedChannel, setSelectedChannel] = useState("-1");
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  if (status === "loading") {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
  }
  return (
    <div className="flex h-screen min-h-screen">
      <Sidebar></Sidebar>
      {isSideBarOpen && (
        <GroupSidebarInfo
          groupId={searchParams.get("groupId") ?? ""}
          setSelectedChannel={setSelectedChannel}
        ></GroupSidebarInfo>
      )}
      <div className="min-w-[314px]"></div>
      {children}
    </div>
  );
}
