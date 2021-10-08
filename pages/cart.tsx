import Button, { Loading } from "../components/Button";
import { styled, Box } from "../stitches.config";
import { PrismaClient, Prisma } from "@prisma/client";
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
import { useCallback, useEffect, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps = async () => {
  /**
   * Get shop meta data from env
   */

  const allShippingOptions = await prisma.shippingCode.findMany({});

  const {
    headline = "Teini is the most smallest shop ever",
    subheadline = "It gets you starting. Without budget. Without the ecommerce complexity you normally see.",
    contact = "Twitter: @zeekrey",
    name = "Teini",
  } = process.env;

  /**
   * Get all shipping options
   */

  return {
    props: {
      meta: {
        headline,
        subheadline,
        contact,
        name,
      },
      shippingOptions: allShippingOptions,
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

const ShippingOptionRadioGroup = styled(RadioGroup.Root, {
  display: "flex",
  flexDirection: "column",
});

const ShippingOption = styled(RadioGroup.Item, {
  all: "unset",
  display: "flex",
  background: "$crimson1",
  flex: 1,
  padding: "$2",
  cursor: "pointer",
  alignItems: "center",

  transition: "all 0.2s",

  "&:hover": {
    background: "$crimson2",
  },

  color: "$mauve10",

  "&[data-state='checked']": {
    color: "$mauve12",
  },
});

const ProductPrice = styled("div", {
  fontSize: "20px",
  lineHeight: "20px",
  fontFamily: "Work Sans, sans-serif",
});

const ShippingOptionIndicator = styled(RadioGroup.Indicator, {
  display: "grid",
  fontSize: "$1",
  fontFamily: "Work Sans",
  borderRadius: "$small",
  background: "$mauve5",
  color: "$mauve12",
  placeContent: "center",
  padding: "$1 $2",
  marginRight: "$2",
});

const CartPage: NextPage<{
  meta: Tmeta;
  shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
}> = ({ meta, shippingOptions }) => {
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOption, setShippingOption] = useState<
    undefined | false | Required<Prisma.ShippingCodeUncheckedCreateInput>
  >(undefined);
  const [productsTotal, setProductsTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartHasProductsWithShipping, setCartHasProductsWithShipping] =
    useState<undefined | boolean>(undefined);

  useEffect(() => {
    setProductsTotal(
      [...cart.values()].reduce(
        (total, item) => total + item.price * item.count,
        0
      )
    );

    if ([...cart.values()].filter((item) => item.needsShipping).length)
      setCartHasProductsWithShipping(true);
    else {
      setCartHasProductsWithShipping(false);
      setShippingOption(false);
    }
  }, [cart]);

  useEffect(() => {
    shippingOption && setCartTotal(productsTotal + (shippingOption?.price || 0));
  }, [productsTotal, shippingOption]);

  const calcShipping = (value: string) => {
    // Get the whole shippingOption object for the provided value
    const selectedShippingOption = shippingOptions.find(
      (shippingOption) => shippingOption.name === value
    );

    // If the cart sum is bigger than 'isFreeFrom' set the shipping costs to 0, otherwise set the shipping costs.
    if (productsTotal >= selectedShippingOption!.isFreeFrom)
      setShippingOption({ ...selectedShippingOption!, price: 0 });
    else setShippingOption(selectedShippingOption!);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    const stripe = await getStripe();
    const lineItems = [...cart.values()].map((item) =>
      cartItemToLineItem({ cartItem: item, images: [""] })
    );

    // Create a line item for shipping costs if they exist
    const lineItemsWithShipping = shippingOption
      ? [
          {
            price_data: {
              currency: "usd",
              unit_amount_decimal: shippingOption?.price,
              product_data: {
                name: shippingOption?.name,
              },
            },
            quantity: 1,
          },
          ...lineItems,
        ]
      : lineItems;

    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line_items: lineItemsWithShipping,
      }),
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
            {cartHasProductsWithShipping && (
              <div>
                <Box
                  as="p"
                  css={{
                    color: "$crimson11",
                  }}
                >
                  Shipping:
                </Box>
                <ShippingOptionRadioGroup
                  onValueChange={(value) => calcShipping(value)}
                >
                  {shippingOptions.map((shippingOption) => (
                    <ShippingOption
                      key={shippingOption.id}
                      id={shippingOption.name}
                      value={shippingOption.name}
                    >
                      <Box
                        as="label"
                        css={{ flex: 1, cursor: "pointer" }}
                        htmlFor={shippingOption.name}
                      >
                        <Box as="strong" css={{ fontFamily: "Work Sans" }}>
                          {shippingOption.name}{" "}
                        </Box>
                        <Box as="small" css={{ display: "block" }}>
                          {shippingOption.description}
                        </Box>
                      </Box>
                      <ShippingOptionIndicator>
                        SELECTED
                      </ShippingOptionIndicator>
                      <ProductPrice>
                        {productsTotal >= shippingOption.isFreeFrom
                          ? "$ 0.00"
                          : `$ ${shippingOption.price / 100}`}
                      </ProductPrice>
                    </ShippingOption>
                  ))}
                </ShippingOptionRadioGroup>
              </div>
            )}
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
                  {cartTotal / 100}
                </Box>
              </div>
              <Button
                disabled={isLoading || typeof shippingOption === "undefined"}
                onClick={handleCheckout}
              >
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
