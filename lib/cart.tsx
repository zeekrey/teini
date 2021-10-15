import { Prisma } from "@prisma/client";
import {
  createContext,
  useReducer,
  FunctionComponent,
  useContext,
} from "react";

export type CartItem = {
  product: Required<Prisma.ProductUncheckedCreateInput>;
  count: number;
  images?: { path: string; blurDataURL: string }[];
};

type CartAction =
  | { type: "removeItem"; item: CartItem }
  | { type: "addItem"; item: CartItem }
  | { type: "clearCart" };
type Dispatch = (action: CartAction) => void;

type CartState = CartItem[] | [];

const CartContext = createContext<
  { cart: CartState; dispatch: Dispatch } | undefined
>(undefined);

const cartReducer = (cart: CartState, action: CartAction) => {
  switch (action.type) {
    case "addItem": {
      // Find the index of the given product
      const foundProductIndex = cart.findIndex(
        (_item) => _item.product.id === action.item.product.id
      );

      // If the product was found, increse the count by 1
      if (foundProductIndex > -1) {
        cart[foundProductIndex].count++;

        // Return a copy of the array, otherwise react won't rerender.
        return [...cart];
      }
      // If the product wasn't found, add it to the cart array
      else {
        return [...cart, { ...action.item, count: 1 }];
      }
    }
    case "removeItem": {
      // Find the index of the given product
      const foundProductIndex = cart.findIndex(
        (_item) => _item.product.id === action.item.product.id
      );

      // If the product has a count > 1, reduce the count by one
      if (foundProductIndex > -1 && cart[foundProductIndex].count > 1) {
        cart[foundProductIndex].count--;
        // Return a copy of the array, otherwise react won't rerender.
        return [...cart];
      }
      // If the product has a count === 1, remove the product from cart
      else {
        cart.splice(foundProductIndex, 1);
        // Return a copy of the array, otherwise react won't rerender.
        return [...cart];
      }
    }
    case "clearCart": {
      return []
    }
    default: {
      throw new Error(`Unhandled action type: ${JSON.stringify(action)}`);
    }
  }
};

const CartProvider: FunctionComponent = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const value = { cart, dispatch };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined)
    throw new Error("useCart must be used within CartProvider");

  // Get the total price for all products in cart
  // @ts-ignore
  const productsTotal: number = context.cart.reduce(
    (total: number, item: CartItem) => total + item.product.price * item.count,
    0
  );

  const needsShipping = !!context.cart.filter(
    (item) => item.product.needsShipping
  ).length;

  return { ...context, productsTotal, needsShipping };
};

export { CartProvider, useCart };
