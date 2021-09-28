import Button from "../components/Button";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import ProductCardCart from "../components/ProductCardCart";
import { getStripe, cartItemToLineItem } from "../lib/stripeHelpers";
import Layout from "../components/Layout";
import PageHeadline from "../components/PageHeadline";

const ProductList = styled("div", {
  display: "grid",
  gap: "$4",
  paddingBottom: "$4",
});

const CartPage = () => {
  const { cart } = useCartStore();

  const handleCheckout = async () => {
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
      <Box
        css={{
          minHeight: "65vh",
        }}
      >
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
              <Button onClick={handleCheckout}>Buy now</Button>
            </Box>
          </>
        ) : (
          <div>Go and add some items to your cart!</div>
        )}
      </Box>
    </>
  );
};

// @ts-ignore
CartPage.layout = Layout;

export default CartPage;
