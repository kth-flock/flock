"use client";

import Image from "next/image";
import Button from "@/shared/components/button";

export function PublicHomePage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#8bc596_0%,#ffffff_80%)]"
        aria-hidden
      />
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <Image
          src="/logo.svg"
          alt="Flock"
          width={100}
          height={100}
          loading="eager"
          className="h-32 w-32 md:h-48 md:w-48"
        />
        <h1 className="flock-h1">Welcome to Flock</h1>
        <h2 className="flock-h3">The independant event creator</h2>
        <ul className="text-left">
          <li className="flock-body">• Create cool events</li>
          <li className="flock-body">• Invite all your friends</li>
          <li className="flock-body">• party party party</li>
        </ul>
        <div className="mt-6 flex w-full items-center justify-center gap-4">
          <Button
            className="w-full justify-center"
            variant="primary"
            size="lg"
            href="/register"
          >
            Sign Up
          </Button>
          <Button
            className="w-full justify-center"
            variant="secondary"
            size="lg"
            href="/login"
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  );
}
