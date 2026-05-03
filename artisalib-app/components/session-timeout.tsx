"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionTimeout() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, 5 * 60 * 1000);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [status]);

  return null;
}