"use client";

import EventPreview from "../dashboard/eventPrievew"
import NotificationList from "../dashboard/notificationList"
import FriendPreview from "../dashboard/friendPreview"
import Image from "next/image"
import Button from "@/shared/components/button";
import { useAuth } from "@/shared/auth/authContext";

function PublicHomePage(){
    return (
        <>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#8bc596_0%,#ffffff_80%)]" aria-hidden />
        <div className = "flex items-center justify-center flex-col gap-5 text-center">
                <Image
                    src="/logo.svg"
                    alt="Flock"
                    width={100}
                    height={100}
                    loading="eager"
                    className="h-32 w-32 md:h-48 md:w-48"
                />
            <h1 className = "flock-h1">Welcome to Flock</h1>
            <h2 className = "flock-h3">The independant event creator</h2>
            <ul className="text-left">
                <li className = "flock-body">• Create cool events</li>
                <li className = "flock-body">• Invite all your friends</li>
                <li className = "flock-body">• party party party</li>
            </ul>
            <div className = "flex items-center justify-center w-full gap-4 mt-6">
                <Button  className="w-full justify-center"variant="primary" size="lg" href="/register">Sign Up</Button>
                <Button className="w-full justify-center" variant="secondary" size="lg" href="/login">Log In</Button>
            </div>
        </div>
        </>
    )
}

function PrivateHomePage(){ //TODO: this prob will come from the dashboard branch so i wont touch it for now //Elinor
    return (
        <main className="flex flex-col md:flex-row gap-4 md:gap-16 flex-1 items-center md:items-start justify-center w-full max-w-6xl">
        <div className="md:sticky md:top-24 w-full flex flex-col gap-4 md:gap-12 md:order-last">
          <FriendPreview />
          <NotificationList />
        </div>
        <div className="w-full flex flex-col gap-4">
          <h2 className="flock-h2">Your next event</h2>
          <EventPreview />
          <h3 className="flock-h3">Upcoming</h3>
          <div className="flex flex-wrap gap-2 justify-between">
            <EventPreview />
            <EventPreview />
          </div>
        </div>
      </main>
    )
}



export default function HomePage(){
    const { user } = useAuth();
    if (user === undefined) return null;
    if (user === null) return <PublicHomePage />;
    return <PrivateHomePage />;
}