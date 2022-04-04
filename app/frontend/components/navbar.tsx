import React, { useEffect, useState } from "react";
import { utils } from "near-api-js";
import ShoppingCart from "../icons/shopping_cart";
import UserIcon from "../icons/user_icon";

import { useGlobalContext } from "../context/appContext";
import { useWalletContext, signIn, signOut } from "../context/walletContext";
import { useWindowSize } from "../hook/windowSize";

import Link from "next/link";
import { MULTISIG_GAS } from "near-api-js/lib/account_multisig";
import { ToastContainer, toast } from "react-toastify";

import { mdiLineScan, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const { cart, mydetails } = useGlobalContext();

  const [toastDispatch, setToastDispatch] = React.useState<any>();

  const { walletConnection, contract, nearConfig, currentUser } =
    useWalletContext();

  React.useEffect(() => {
    walletConnection?.isSignedIn() ? setLoggedIn(true) : setLoggedIn(false);
  });

  useEffect(() => {
    if (mydetails.balance > 0) {
      // toast.dismiss(toastId.current)
      clearTimeout(toastDispatch);
    } else {
      const disp = setTimeout(() => {
        toast(
          "Your NEAR-SMT balance is 0. You can buy some tokens using '$' icon."
        );
      }, 15000);
      if (toastDispatch) {
        clearInterval(toastDispatch);
      }
      setToastDispatch(disp);
    }
  }, [mydetails.balance]);

  return (
    <div className="flex flex-wrap place-items-center w-full">
      <section className="relative mx-auto w-full">
        {/* <!-- navbar --> */}
        {loggedIn && (
          <LoggedInNavbar
            mydetails={mydetails}
            contract={contract}
            loggedIn={loggedIn}
            cart={cart}
            nearConfig={nearConfig}
            walletConnection={walletConnection}
          />
        )}
      </section>
      <ToastContainer />
    </div>
  );
};

function LoggedInNavbar(props: any) {
  const { mydetails, contract, loggedIn, cart, nearConfig, walletConnection } =
    props;
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);
  const [component, setComponent] = useState<any>();

  useEffect(() => {
    if (width) {
      if (width < 1280 && width > 768) {
        setComponent(
          <div className="flex w-full flex-col place-items-center bg-gray-900 p-3">
            {mydetails.balance > 0 && (
              <p className="capitalize text-white">
                NEAR-SMT: {mydetails.balance}
              </p>
            )}
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
                className="text-white hover:bg-white hover:text-black pl-5 pr-5 rounded w-min"
                onClick={() => signOut(walletConnection)}
              >
                Logout
              </button>
            )}
          </div>
        );
      }
      if (width < 768) {
        setComponent(
          <div className="flex w-full flex-col place-items-center bg-gray-900 p-3">
            <ul className="px-4 mx-auto font-semibold font-heading text-white flex flex-col">
              <li className="flex justify-center item-center">
                <Link href="/">
                  <a className="hover:text-gray-200">Home</a>
                </Link>
              </li>
              <li className="flex justify-center item-center">
                <Link href="/view">
                  <a className="hover:text-gray-200">View Your Products</a>
                </Link>
              </li>
              <li className="flex justify-center item-center">
                <Link href="/edit">
                  <a className="hover:text-gray-200">Edit</a>
                </Link>
              </li>
              <li className="flex justify-center item-center">
                <Link href="/orders">
                  <a className="hover:text-gray-200">Orders</a>
                </Link>
              </li>
            </ul>
            <div className="bg-white h-1 w-full my-3 rounded"></div>
            {mydetails.balance > 0 && (
              <p className="capitalize text-white">
                NEAR-SMT: {mydetails.balance}
              </p>
            )}
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
                className="text-white hover:bg-white hover:text-black pl-5 pr-5 rounded w-min"
                onClick={() => signOut(walletConnection)}
              >
                Logout
              </button>
            )}
          </div>
        );
      }
    }
  }, [width]);

  return (
    <div className="flex flex-col w-full">
      <nav className="flex justify-between bg-gray-900 text-white w-100">
        <div className="px-5 xl:px-12 py-6 flex w-full items-center">
          <Link href="/">
            <a className="text-3xl font-bold font-heading">
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
            <li>
              <Link href="/orders">
                <a className="hover:text-gray-200">Orders</a>
              </Link>
            </li>
          </ul>
          {/* <!-- Header Icons --> */}
          <div className="hidden xl:flex items-center space-x-5">
            <BuyFungibleTokenIcon
              className="flex items-center hover:text-gray-200 cursor-pointer"
              contract={contract}
            />
            {mydetails.balance > 0 && (
              <p className="capitalize text-white">
                NEAR-SMT: {mydetails.balance}
              </p>
            )}
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
                onClick={() =>
                  signIn(walletConnection as any, contract, nearConfig)
                }
              >
                <UserIcon />
              </a>
            ) : (
              <button
                className="hover:bg-white hover:text-black pl-5 pr-5 rounded"
                onClick={() => signOut(walletConnection as any)}
              >
                Logout
              </button>
            )}
          </div>
        </div>
        {/* <!-- Responsive navbar --> */}

        <BuyFungibleTokenIcon
          contract={contract}
          className="navbar-burger self-center mr-12 xl:hidden cursor-pointer"
        />
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
          <a
            className="navbar-burger self-center mr-12 xl:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <Icon path={mdiClose} size={1} />
            ) : (
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
            )}
          </a>
        </Link>
      </nav>
      {open && component}
    </div>
  );
}

function BuyFungibleTokenIcon({ contract, className }: any) {
  async function buyStablecoin() {
    await contract.buy_ft({
      args: {},
      gas: MULTISIG_GAS,
      amount: utils.format.parseNearAmount("1"),
      meta: "buy_ft",
    });
  }
  return (
    <a
      className={className}
      title="1 NEAR -> 100 NEAR-SMT"
      onClick={buyStablecoin}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </a>
  );
}

export default Navbar;
