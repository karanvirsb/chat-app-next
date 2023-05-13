import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";

import Sidebar from "./Sidebar";
import Spinner from "./Spinner/Spinner";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
    <div className="flex h-[100dvh] max-h-[100dvh]">
      <Sidebar></Sidebar>
      {/* <div className="min-w-[314px]"></div> */}
      {children}
    </div>
  );
}
