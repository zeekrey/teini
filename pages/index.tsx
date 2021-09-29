import { GetStaticProps } from "next";
import Link from "next/link";
import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import Layout from "../components/Layout";
import { styled, Box } from "../stitches.config";
import ProductCard from "../components/ProductCard";
import MenuBar from "../components/MenuBar";
import Button from "../components/Button";
import { promises as fs } from "fs";
import path from "path";
import { ArrowRightIcon } from "@modulz/radix-icons";
import PageHeadline from "../components/PageHeadline";
import type { Tmeta } from "../types";
import Footer from "../components/Footer";

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

const Grid = styled("div", {
  display: "grid",
  gap: "$4",
});

const Home: React.FunctionComponent<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
  images: { id: number; paths: string[] }[];
  meta: Tmeta;
}> = ({ products, images, meta }) => {
  return (
    <>
      <MenuBar />
      <PageHeadline>{meta.headline}</PageHeadline>
      <Box
        as="p"
        css={{
          color: "$crimson11",
          fontSize: "16px",
          paddingBottom: "$4",
          margin: 0,
        }}
      >
        {meta.subheadline}
      </Box>
      <Grid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={images.filter((image) => image.id === product.id)[0]}
          />
        ))}
      </Grid>
      <Link href="/products" passHref>
        <Button
          as="a"
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "$4 0",
          }}
        >
          <span>See all products</span>
          <ArrowRightIcon />
        </Button>
      </Link>
      <Footer {...meta} />
    </>
  );
};

// @ts-ignore
Home.layout = Layout;

export default Home;
