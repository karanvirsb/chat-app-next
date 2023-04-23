import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  // const router = useRouter();
  // const { status } = useSession({
  //   required: true,
  // });

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.replace("/me");
  //   } else {
  //     router.replace("/auth/signin");
  //   }
  // }, [router, status]);
  return (
    <>
      <Head>
        <title>Chatter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen min-h-screen"></div>
    </>
  );
}
