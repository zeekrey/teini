import { useCartStore } from "../lib/cart";
import { getStripe, cartItemToLineItem } from "../lib/stripeHelpers";

const Cart = () => {
  const { cart, addItem, removeItem, clearCart } = useCartStore();

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
    <div>
      <strong>
        Cart <button onClick={() => clearCart()}>Clear Cart</button>
      </strong>
      {cart.size && (
        <ul>
          {[...cart.values()].map((item) => (
            <li key={item.id}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;
