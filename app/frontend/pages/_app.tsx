import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";
import React from 'react';
import { initContract } from "../utils/utils";

function MyApp({ Component, pageProps }: AppProps) {
  // const {store, props} = wrapper.useWrappedStore(rest);

  React.useEffect(() => {
    window.nearInitPromise = initContract()

  });

  return  (<Provider store={store}>
    <Component {...pageProps} />
  </Provider>);
}

export default MyApp;
