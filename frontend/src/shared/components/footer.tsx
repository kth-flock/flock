import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/create-event", label: "Create event" },
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full pt-12">
      <div className="flex flex-col gap-6 border-t border-accent/40 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <span className="flex flex-col">
            <span className="flock-h4 font-serif! text-primary">Flock</span>
            <span className="flock-caption">Bring your friends!</span>
          </span>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="flock-body-sm text-primary underline-offset-4 hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="flock-caption">
          © {new Date().getFullYear()} Flock. A project for <b>DH2643 Advanced Interaction Programming</b>.
        </p>
      </div>
    </footer>
  );
}
