import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from "next/app";
import React from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { GlobalContextWrapper } from "../context/appContext";
import { WalletContextWrapper } from "../context/walletContext";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WalletContextWrapper>
      <GlobalContextWrapper>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </GlobalContextWrapper>
    </WalletContextWrapper>
  );
}

export default MyApp;
