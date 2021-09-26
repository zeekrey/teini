import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";

const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  /**
   * Get all products with
   * availability !== notVisible
   */
  const allVisibleProducts = await prisma.product.findMany({
    where: {
      availability: {
        not: "notVisible",
      },
    },
  });

  return {
    props: {
      products: allVisibleProducts.map((product) => ({
        ...product,
        // Date objects needs to be converted to strings because the props object will be serialized as JSON
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString(),
      })),
    },
  };
};

const Home: NextPage<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
}> = ({ products }) => {
  const { cart, addItem, removeItem, clearCart } = useCartStore();

  return (
    <main>
      <ul>
        {products.map((product) => (
          <li key={product.slug}>
            <a href={`products/${product.slug}`}>{product.name}</a>
            <button onClick={() => addItem(product, cart)}>Add</button>
            <button onClick={() => removeItem(product, cart)}>Remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
