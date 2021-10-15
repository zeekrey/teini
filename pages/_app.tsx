import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { globalStyles, darkTheme } from "../stitches.config";
import { ThemeProvider } from "next-themes";
import { IdProvider } from "@radix-ui/react-id";
import { CartProvider } from "../lib/cart";

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
    <IdProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        value={{
          dark: darkTheme.className,
          light: "light",
        }}
      >
        <CartProvider>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </CartProvider>
      </ThemeProvider>
    </IdProvider>
  );
}
export default MyApp;
