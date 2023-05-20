import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getCsrfToken } from "next-auth/react";
import { getProviders, signIn } from "next-auth/react";
import React, { useState } from "react";

import { authOptions } from "../../api/auth/[...nextauth]";

export default function Signup({
  csrfToken,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  // TODO error checks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="flex flex-col justify-center items-center w-full h-screen">
      <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-center mx-auto">
          <Image
            className=""
            width={100}
            height={100}
            src="/images/logo-nobg.svg"
            alt="Chatter"
          />
        </div>

        <form className="mt-6" method="post" onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-800 dark:text-gray-200"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm text-gray-800 dark:text-gray-200"
              >
                Password
              </label>
            </div>

            <input
              type="password"
              name="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="mt-6">
            <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
              Sign Up
            </button>
          </div>
        </form>
        {Object.values(providers).map(
          (provider) =>
            provider.name.toLowerCase() !== "credentials" && (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Sign up with {provider.name}
                </button>
              </div>
            )
        )}
        <p className="mt-8 text-xs font-light text-center text-gray-400">
          <Link
            href="/auth/signin"
            className="font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Already have an account?
          </Link>
        </p>
      </div>
    </main>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data: { completedRegistration: boolean } = await result.json();
    console.log(data);
    if (result.status === 200 && data.completedRegistration) {
      router.push("/auth/signin");
    }
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers: providers ?? [],
    },
  };
}
