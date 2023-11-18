import Image from "next/image";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImageUploading, { ImageListType } from "react-images-uploading";
import supabase from "@/utils/supabaseClient";

type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const router = useRouter();

  function goToLogin() {
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center p-24">
      <div className="flex flex-row justify-end flex-wrap z-10 max-w-8xl w-full font-mono text-sm">
        <div className="fixed left-0 top-0 flex flex-row w-full justify-center items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 py-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit ">
          For started editing go to
          <button
            type="button"
            className="mx-4 rounded-xl bg-blue-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 lg:bottom-8 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black ">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </a>
      </div>
    </main>
  );
}
