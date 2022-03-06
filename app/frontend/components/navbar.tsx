import React, { useContext } from "react";

import Heart from "../icons/heart";
import ShoppingCart from "../icons/shopping_cart";
import UserIcon from "../icons/user_icon";

import { useGlobalContext } from "../context/appContext";
import { useWalletContext, signIn, signOut } from "../context/walletContext";

import Link from "next/link";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const { cart } = useGlobalContext();
  const {
    walletConnection,
    contract,
    nearConfig,
    currentUser
  } = useWalletContext();

  React.useEffect(() => {
    walletConnection?.isSignedIn() ? setLoggedIn(true) : setLoggedIn(false)
  })

  return (
    <div className="flex flex-wrap place-items-center w-full">
      <section className="relative mx-auto w-full">
        {/* <!-- navbar --> */}
        <nav className="flex justify-between bg-gray-900 text-white w-100">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <Link href="/">
              <a className="text-3xl font-bold font-heading" >
                {/* <!-- <img className="h-9" src="logo.png" alt="logo"> --> */}
                Nearbay.
              </a>
            </Link>
            {/* <!-- Nav Links --> */}
            <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
              <li>
                <Link href="/">
                  <a className="hover:text-gray-200">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/view">
                  <a className="hover:text-gray-200">View Your Products</a>
                </Link>
              </li>
              <li>
                <Link href="/edit">
                  <a className="hover:text-gray-200">Edit</a>
                </Link>
              </li>
            </ul>
            {/* <!-- Header Icons --> */}
            <div className="hidden xl:flex items-center space-x-5">
              {/* <a className="hover:text-gray-200" href="#">
                <Heart />
              </a> */}
              <Link href="/cart">
                <a className="flex items-center hover:text-gray-200">
                  <ShoppingCart />
                  {cart.length >= 1 && (
                    <span className="flex absolute -mt-5 ml-4">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>
                  )}
                </a>
              </Link>
              {/* <!-- Sign In / Register      --> */}
              {!loggedIn ? (
                <a
                  className="flex items-center hover:text-gray-200"
                  href="#"
                  onClick={() => signIn(walletConnection, contract, nearConfig)}
                >
                  <UserIcon />
                </a>
              ) : (
                <button
                  className="hover:bg-white hover:text-black pl-5 pr-5 rounded"
                  onClick={() => signOut(walletConnection)}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          {/* <!-- Responsive navbar --> */}
          <Link href="/cart">
            <a className="xl:hidden flex mr-6 items-center">
              <ShoppingCart />
              {cart.length >= 1 && (
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              )}
            </a>
          </Link>
          <Link href="#">
            <a className="navbar-burger self-center mr-12 xl:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </a>
          </Link>
        </nav>
      </section>
    </div>
  );
};

export default Navbar;
