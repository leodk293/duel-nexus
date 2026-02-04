"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className=" flex flex-col items-center">
      <button
        className=" cursor-pointer border border-transparent px-4 py-2 rounded-sm bg-black text-white font-medium"
        onClick={() => signIn("google")}
      >
        Signin
      </button>
    </div>
  );
}
