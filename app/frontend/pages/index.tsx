import type { NextPage } from "next";
import { initContract } from "../utils/utils";
import React from 'react';
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Footer from "../components/footer";
import Navbar from "../components/navbar";

import Products from "../components/products";

const Home: NextPage = () => {

  React.useEffect(() => {
    window.nearInitPromise = initContract()

  }, [])

  return (
    <div className="w-100 flex flex-col items-center">
      <Head>
        <title>Nearbay.</title>
      </Head>
      
      <main className="container content-center w-full m-0">

        <p className={styles.description}>
          A marketplace which is secured by
          <code className={styles.code}>Near Blockchain.</code>
        </p>

        
        <Products />
        
      </main>
    </div>
  );
};

export default Home;
