import type { NextPage } from "next";
import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Products from "../components/products";
import { useGlobalContext } from "../context/appContext";
import { signIn, useWalletContext } from "../context/walletContext";

const Home: NextPage = () => {
  const {
    walletConnection,
    currentUser, nearConfig, contract
  } = useWalletContext();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (walletConnection) {
      if (walletConnection.isSignedIn()) {
        console.log("User is Signed In.");
        setLoggedIn(true);
      }
      // else {
      //   signIn(walletConnection, contract, nearConfig);
      // }
    }
  }, [walletConnection]);

  return (
    <div className="w-100 flex flex-col items-center min-h-screen">
      <Head>
        <title>Nearbay.</title>
      </Head>

      <main className="container content-center w-full m-0">

        <p className={styles.description}>
          A marketplace which is secured by
          <code className={styles.code}>Near Blockchain.</code>
        </p>

        {
          !loggedIn &&
          <PleaseLogIn />
        }

        {
          loggedIn &&
          <Products />
        }
      </main>
    </div>
  );
};

function PleaseLogIn(props: any) {
  const {
    walletConnection,
    currentUser, nearConfig, contract
  } = useWalletContext();

  function doLogin() {
    if (walletConnection) {
      signIn(walletConnection, contract, nearConfig);
    }
  }

  return (
    <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
      <button onClick={doLogin} className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
        Login
      </button>
    </div>
  )
}

export default Home;
