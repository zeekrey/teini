import Button from "../components/Button";
import MenuBar from "../components/MenuBar";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import ProductCart from "../components/ProductCart";
import { getStripe, cartItemToLineItem } from "../lib/stripeHelpers";
import Layout from "../components/Layout";

const ProductList = styled("div", {
  display: "grid",
  gap: "$2",
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
    <MenuBar>
      <Box css={{ padding: "$2" }}>
        <ProductList>
          {cart.size &&
            [...cart.values()].map((item) => (
              <ProductCart key={item.id} product={item} />
            ))}
        </ProductList>
        <div>
          Total: {/* Get the currency code of the first item for now. */}
          {currencyCodeToSymbol(cart.values().next().value.currency)}
          {[...cart.values()].reduce(
            (total, item) => total + item.price * item.count,
            0
          ) / 100}
        </div>
        <Button onClick={handleCheckout}>Buy now</Button>
      </Box>
    </MenuBar>
  );
};

// @ts-ignore
CartPage.layout = Layout;

export default CartPage;
