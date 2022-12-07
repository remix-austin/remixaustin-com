import { Link } from "@remix-run/react";
import SocialLinks from "./SocialLinks";

export const homepageLinkTitle = "Remix Austin 💿";

export default function Navbar() {
  return (
    <nav className="navbar bg-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn md:hidden">
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
        <Link to="/" className="btn-ghost btn text-xl normal-case">
          {homepageLinkTitle}
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal p-0 text-lg">
          {/* <li>
            <Link to="/blog">Blog</Link>
          </li> */}
          {/* <li tabIndex={0}>
            <a>
              Parent
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Item 3</a>
          </li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <ul className="mr-4 flex gap-2">
          <SocialLinks linkClassName="btn-ghost btn hidden md:inline-flex gap-x-2" />
        </ul>
      </div>
    </nav>
  );
}
