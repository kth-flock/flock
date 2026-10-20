import type { Metadata } from "next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import ProfileImage from "@/shared/components/profileImage";

export const metadata: Metadata = { title: "About us • Flock" };

const contributors: {
  firstName: string;
  lastName: string;
  github: string;
  linkedin: string;
  cardColor: string;
}[] = [
  {
    firstName: "Sandra",
    lastName: "Kåhre",
    github: "https://github.com/skahre",
    linkedin: "https://www.linkedin.com/in/sandra-kahre/",
    cardColor: "bg-success-light ring-success-dark",
  },
  {
    firstName: "Alice",
    lastName: "Cohen",
    github: "https://github.com/aliceco",
    linkedin: "https://www.linkedin.com/in/alicecohenr/",
    cardColor: "bg-[#ece6f0] ring-[#5e4a6e]",
  },
  {
    firstName: "Tilde",
    lastName: "Tärnvik",
    github: "https://github.com/tarnvik",
    linkedin: "https://www.linkedin.com/in/tilde-tarnvik/",
    cardColor: "bg-[#faf0c8] ring-[#86691a]",
  },
  {
    firstName: "Elinor",
    lastName: "Selinder",
    github: "https://github.com/ElinorSel",
    linkedin: "https://www.linkedin.com/in/elinorselinder/",
    cardColor: "bg-error-light ring-error-dark",
  },
  {
    firstName: "Felix",
    lastName: "Larsson",
    github: "https://github.com/felarsson",
    linkedin: "https://www.linkedin.com/in/felars/",
    cardColor: "bg-info-light ring-info-dark",
  },
];

// Profile pictures are fetched from github.com/<username>.png
const githubAvatar = (githubUrl: string) =>
  `https://github.com/${new URL(githubUrl).pathname.split("/").filter(Boolean)[0]}.png`;

const linkStyle =
  "inline-flex items-center gap-1.5 flock-body-sm text-primary underline-offset-4 hover:underline";

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="flock-h1 text-primary">About Flock</h1>
        <p className="flock-lead">
          Flock is a simple, private and fun way to plan events with your
          friends - without any social media accounts.
        </p>
        <p className="flock-body">
          We have all been forced to use <i>that</i> social media app to coordinate events with our friends.{" "}
          {"It's not fun, it's not pretty, and it sure isn't private."}
          <br /><br />With Flock, you can create events, invite your friends, and RSVP to events all in one place (and yes, you can even explain your reason for not attending without notifying literally everyone).
        </p>
      </section>
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span aria-hidden className="h-px flex-1 bg-primary/30" />
          <h2 className="flock-h2 shrink-0 text-center text-primary">
            The team
          </h2>
          <span aria-hidden className="h-px flex-1 bg-primary/30" />
        </div>
        <ul className="flex flex-wrap justify-center gap-4">
          {contributors.map(
            ({ firstName, lastName, github, linkedin, cardColor }, i) => (
              <li
                key={i}
                className={twMerge(
                  "flex w-full items-center gap-4 rounded-2xl p-4 ring-[2px] sm:w-[calc(50%-0.5rem)] md:p-6",
                  cardColor,
                )}
              >
                <ProfileImage
                  className={twMerge("size-14 ring-[2px]", cardColor)}
                  firstName={firstName}
                  lastName={lastName}
                  profileImgSrc={githubAvatar(github)}
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flock-h5 truncate">
                    {firstName} {lastName}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkStyle}
                    >
                      <FaGithub aria-hidden />
                      GitHub
                    </a>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkStyle}
                    >
                      <FaLinkedin aria-hidden />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
        <div aria-hidden className="mx-auto size-48">
          <DotLottieReact src="/flock-load.json" loop autoplay />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <p className="flock-body">
          This project was created as part of the course <b>DH2643 Advanced Interaction Programming</b> at KTH Royal Institute of Technology, Stockholm, Sweden.
        </p>
      </section>
    </main>
  );
}