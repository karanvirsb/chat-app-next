import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { useAppSelector } from "@/Hooks/reduxHooks";
import GroupSidebarInfo from "@/pages/group/Components/GroupSidebarInfo";

import Sidebar from "./Sidebar";
import Spinner from "./Spinner/Spinner";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/signin");
    },
  });

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
      {/* <div className="min-w-[314px]"></div> */}
      {children}
    </div>
  );
}
