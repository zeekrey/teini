import create from "zustand";
import { persist } from "zustand/middleware";
import { Prisma } from "@prisma/client";
import { replacer, reviver } from "./mapToObject";

type CartState = {
  cart:
    | Map<
        number,
        Required<
          Prisma.ProductUncheckedCreateInput & {
            count: number;
          }
        > & { images?: string[] }
      >
    | Map<any, any>;
  removeItem: (
    item: Required<Prisma.ProductUncheckedCreateInput> & { images?: string[] },
    cart: Map<number, Prisma.ProductUncheckedCreateInput & { count: number }>
  ) => void;
  addItem: (
    item: Required<Prisma.ProductUncheckedCreateInput> & { images?: string[] },
    cart: Map<
      number,
      Prisma.ProductUncheckedCreateInput & { count: number; images?: string[] }
    >
  ) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      cart: new Map(),
      removeItem: (item, cart) => {
        // Use non-null assertion because of https://github.com/microsoft/TypeScript/issues/41045#issuecomment-706722695
        if (cart.size && cart.get(item.id)!.count > 1)
          set((state) => {
            state.cart.get(item.id)!.count--;
          });
        else
          set((state) => {
            state.cart.delete(item.id);
          });
      },
      addItem: (item, cart) => {
        if (cart.has(item.id))
          set((state) => {
            state.cart.get(item.id)!.count++;
          });
        else
          set((state) => {
            state.cart.set(item.id, { ...item, count: 1 });
          });
      },
      clearCart: () => {
        set(({ cart }) => cart.clear());
      },
    }),
    {
      name: "cart-storage",
      serialize: (state) => JSON.stringify(state, replacer),
      deserialize: (str) => JSON.parse(str, reviver),
    }
  )
);
