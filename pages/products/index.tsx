import { GetStaticProps } from "next";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../../lib/cart";
import Layout from "../../components/Layout";
import { styled, Box } from "../../stitches.config";
import ProductCard from "../../components/ProductCard";
import MenuBar from "../../components/MenuBar";

const prisma = new PrismaClient();

const Headline = styled("h1", {
  fontFamily: "Work Sans, sans serif",
  fontSize: "32px",
  color: "$crimson12",
});

const Subheadline = styled("h1", {
  fontFamily: "Roboto, sans serif",
  fontSize: "18px",
  fontWeight: "normal",
  color: "$mauve9",
});

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

  /**
   * Get all images forthose products that are place under /public/products/[id]
   */

  if (allVisibleProducts) {
    let allImagePaths = [];

    for (const product of allVisibleProducts) {
      const imagesDirectory = path.join(
        process.cwd(),
        `public/products/${product.id}`
      );

      try {
        const productImagePaths = await fs.readdir(imagesDirectory);
        allImagePaths.push({
          id: product.id,
          paths: productImagePaths.map(
            (path) => `/products/${product.id}/${path}`
          ),
        });
      } catch (error) {
        console.warn(
          `Image ${product.name} has no images under /public/product/[id]!`
        );
      }
    }

    return {
      props: {
        products: allVisibleProducts.map((product) => ({
          ...product,
          // Date objects needs to be converted to strings because the props object will be serialized as JSON
          createdAt: product.createdAt.toString(),
          updatedAt: product.updatedAt.toString(),
        })),
        images: await Promise.all(allImagePaths),
      },
    };
  } else return { props: {} };
};

const Grid = styled("main", {
  padding: "$2",
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "$2",
});

const Products: React.FunctionComponent<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
  images: { id: number; paths: string[] }[];
}> = ({ products, images }) => {
  console.log(images.filter((image) => image.id === products[0].id));
  // const { cart, addItem, removeItem, clearCart } = useCartStore();

  return (
    <MenuBar>
      <Grid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={images.filter((image) => image.id === product.id)[0]}
          />
        ))}
      </Grid>
    </MenuBar>
  );
};

// @ts-ignore
Products.layout = Layout;

export default Products;
