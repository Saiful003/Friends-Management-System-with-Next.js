import "../styles/globals.css";
import React from "react";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import store from "../store/store";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <NextNProgress
          color="#00b97e"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={false}
          options={{ showSpinner: false }}
        />
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
