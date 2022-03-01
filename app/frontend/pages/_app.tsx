import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { initContract } from "../utils/utils";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { GlobalContextWrapper} from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {

  React.useEffect(() => {
    window.nearInitPromise = initContract();
  });


  return (
    <GlobalContextWrapper>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </GlobalContextWrapper>
  );
}

export default MyApp;
