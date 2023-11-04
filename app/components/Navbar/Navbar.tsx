import { Link } from "@remix-run/react";
import SocialLinks from "./SocialLinks";

export const homepageLinkTitle = "Remix Austin 💿";

export default function Navbar() {
  return (
    <nav className="navbar bg-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <SocialLinks />
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl normal-case">
          {homepageLinkTitle}
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="mr-4 flex gap-2">
          <SocialLinks linkClassName="btn-ghost btn hidden md:inline-flex gap-x-2" />
        </ul>
      </div>
    </nav>
  );
}
