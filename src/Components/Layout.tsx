import React from "react";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/api/auth/signin");
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
    <>
      <Sidebar></Sidebar>
      <div className=""></div>
      {children}
    </>
  );
}
