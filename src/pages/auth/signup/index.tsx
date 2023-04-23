import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";
import React from "react";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function Signup({
  csrfToken,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
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
      <form
        method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "John", password: "John_123" }),
          });
        }}
      >
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        <label>
          Username
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
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
