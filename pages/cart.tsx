import Button, { Loading } from "../components/Button";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import ProductCardCart from "../components/ProductCardCart";
import { getStripe, cartItemToLineItem } from "../lib/stripeHelpers";
import Layout from "../components/Layout";
import PageHeadline from "../components/PageHeadline";
import Footer from "../components/Footer";
import { GetStaticProps, NextPage } from "next";
import { Tmeta } from "../types";
import MenuBar from "../components/MenuBar";
import { NextSeo } from "next-seo";
import { useState } from "react";

export const getStaticProps: GetStaticProps = () => {
  /**
   * Get shop meta data from env
   */

  const {
    headline = "Teini is the most smallest shop ever",
    subheadline = "It gets you starting. Without budget. Without the ecommerce complexity you normally see.",
    contact = "Twitter: @zeekrey",
    name = "Teini",
  } = process.env;

  return {
    props: {
      meta: {
        headline,
        subheadline,
        contact,
        name,
      },
    },
  };
};

const ProductList = styled("div", {
  paddingBottom: "$4",
  display: "grid",
  gap: "$4",

  "@small": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  "@medium": {
    gap: "$5",
  },

  "@large": {
    gap: "40px",
  },
});

const CartPage: NextPage<{ meta: Tmeta }> = ({ meta }) => {
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true)
    const stripe = await getStripe();
    const lineItems = [...cart.values()].map((item) =>
      cartItemToLineItem({ cartItem: item, images: [""] })
    );

    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: lineItems }),
    });

    const session = await response.json();

    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });
    error && console.warn(error.message);
  };

  return (
    <>
      <NextSeo noindex={true} />
      <MenuBar />
      <PageHeadline>Cart</PageHeadline>
      <Box
        as="p"
        css={{
          color: "$crimson11",
          fontSize: "16px",
        }}
      >
        To protect you and us the checkout will be processed by Stripe.
      </Box>
      <>
        {cart.size ? (
          <>
            <ProductList>
              {[...cart.values()].map((item) => (
                <ProductCardCart key={item.id} product={item} />
              ))}
            </ProductList>
            <Box
              css={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "$4",
                marginLeft: "-$4",
                paddingRight: "$4",
                marginRight: "-$4",
                borderBottom: "1px solid $mauve4",
                borderTop: "1px solid $mauve4",
              }}
            >
              <div>
                <Box
                  css={{
                    color: "$crimson11",
                  }}
                >
                  Total:
                  {/* Get the currency code of the first item for now. */}
                </Box>
                <Box
                  css={{
                    fontFamily: "Work Sans, sans serif",
                    color: "$crimson12",
                    fontSize: "22px",
                  }}
                >
                  {currencyCodeToSymbol(cart.values().next().value.currency)}
                  {[...cart.values()].reduce(
                    (total, item) => total + item.price * item.count,
                    0
                  ) / 100}
                </Box>
              </div>
              <Button disabled={isLoading} onClick={handleCheckout}>
                {isLoading ? <Loading /> : "Buy now"}
              </Button>
            </Box>
          </>
        ) : (
          <div>Go and add some items to your cart!</div>
        )}
      </>
      <Footer {...meta} />
    </>
  );
};

// @ts-ignore
CartPage.layout = Layout;

export default CartPage;
