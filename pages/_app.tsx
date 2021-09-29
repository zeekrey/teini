import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { NextComponentType } from "next";
import { globalStyles, darkTheme } from "../stitches.config";
import { ThemeProvider } from "next-themes";

type NextPageWithLayout = NextPage & {
  layout: React.FunctionComponent;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const PageLayout = Component.layout ?? (({ children }) => children);
  globalStyles();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      value={{
        dark: darkTheme.className,
        light: "light",
      }}
    >
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ThemeProvider>
  );
}
export default MyApp;
