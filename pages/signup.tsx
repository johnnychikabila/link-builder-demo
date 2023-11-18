import supabase from "@/utils/supabaseClient";
import "@/app/globals.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [username, setUserName] = useState<string | undefined>();
  const router = useRouter();

  async function signUpWithEmail() {
    try {
      if (email && password) {
        const resp = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (resp.error) throw resp.error;
        const userId = resp.data.user?.id;
        if (userId) {
          await createUser(userId);
          console.log("userId: ", userId);
          router.push("/login");
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function createUser(userId: string) {
    try {
      const { error } = await supabase
        .from("users")
        .insert({ id: userId, username: username }); //user_id > id
      if (error) throw error;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function goToLogin() {
    router.push("/login");
  }
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-start pt-24 w-[70vw] lg:w-[20vw]">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            name="email"
            placeholder="your@mail"
            id="email"
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Username
        </label>
        <div className="mt-1">
          <input
            name="username"
            placeholder="your name"
            id="username"
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <label
          htmlFor="password"
          className="blovk text-sm font-medium text-gray-700 mt-4"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            name="password"
            placeholder="********"
            id="password"
            type="password"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex">
          <button
            type="button"
            className="mt-4 rounded-xl bg-gray-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
            onClick={signUpWithEmail}
          >
            Sign up
          </button>
          <button
            type="button"
            className="mt-4 mx-2 rounded-xl bg-blue-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
