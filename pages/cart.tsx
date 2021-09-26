import { Prisma } from "@prisma/client";
import Button from "../components/Button";
import MenuBar from "../components/MenuBar";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import ProductCart from "../components/ProductCart";
import { getStripe, cartItemToLineItem } from "../lib/stripeHelpers";

const ProductList = styled("div", {
  display: "grid",
  gap: "$2",
});

const CartPage = () => {
  const { cart, addItem, removeItem } = useCartStore();

  const handleCheckout = async () => {
    const stripe = await getStripe();
    const lineItems = [...cart.values()].map((item) =>
      cartItemToLineItem(item)
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
    <Box
      css={{
        height: "100vh",
        background:
          "radial-gradient(circle at top left, $crimson4, rgba(255, 255, 255, 0) 30%), radial-gradient(circle at bottom right, $crimson4, rgba(255, 255, 255, 0) 30%)",
      }}
    >
      <MenuBar>
        <Box css={{ padding: "$2" }}>
          <ProductList>
            {cart.size &&
              [...cart.values()].map((item) => (
                <ProductCart key={item.id} product={item} />
              ))}
          </ProductList>
          <div>
            Total:{" "}
            {[...cart.values()].reduce(
              (total, item) => total + item.price * item.count,
              0
            )}
          </div>
          <Button onClick={handleCheckout}>Buy now</Button>
        </Box>
      </MenuBar>
    </Box>
  );
};

export default CartPage;
