import { GetStaticProps } from "next";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../../lib/cart";
import Layout from "../../components/Layout";
import { styled, Box } from "../../stitches.config";
import ProductCard from "../../components/ProductCard";
import PageHeadline from "../../components/PageHeadline";
import { Tmeta } from "../../types";
import Footer from "../../components/Footer";
import MenuBar from "../../components/MenuBar";

const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps = async ({ params }) => {
   /**
   * Get shop meta data from env
   */

    const {
      headline = "Teini is the most smallest shop ever",
      subheadline = "It gets you starting. Without budget. Without the ecommerce complexity you normally see.",
      contact = "Twitter: @zeekrey",
      name = "Teini",
    } = process.env;
  
   
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
        meta: {
          headline,
          subheadline,
          contact,
          name,
        },
      },
    };
  } else return { props: {} };
};

const Grid = styled("main", {
  display: "grid",
  // gridTemplateColumns: "repeat(2, 1fr)",
  gap: "$2",
  paddingBottom: "$4",
});

const Products: React.FunctionComponent<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
  images: { id: number; paths: string[] }[];
  meta: Tmeta
}> = ({ products, images, meta }) => {
  console.log(images.filter((image) => image.id === products[0].id));
  // const { cart, addItem, removeItem, clearCart } = useCartStore();

  return (
    <>
    <MenuBar />
      <PageHeadline>All Products</PageHeadline>
      <Grid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={images.filter((image) => image.id === product.id)[0]}
          />
        ))}
      </Grid>
      <Footer {...meta}/>
    </>
  );
};

// @ts-ignore
Products.layout = Layout;

export default Products;
