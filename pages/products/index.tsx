import { GetStaticProps } from "next";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import Layout from "../../components/Layout";
import { styled, Box } from "../../stitches.config";
import ProductCard from "../../components/ProductCard";
import PageHeadline from "../../components/PageHeadline";
import { Tmeta } from "../../types";
import Footer from "../../components/Footer";
import MenuBar from "../../components/MenuBar";
import { NextSeo } from "next-seo";
import { getPlaiceholder } from "plaiceholder";

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

        const blurDataURLs = await Promise.all(
          productImagePaths.map(async (src) => {
            const { base64 } = await getPlaiceholder(
              `/products/${product.id}/${src}`
            );
            return base64;
          })
        ).then((values) => values);

        allImagePaths.push({
          id: product.id,
          images: {
            paths: productImagePaths.map(
              (path) => `/products/${product.id}/${path}`
            ),
            blurDataURLs: blurDataURLs,
          },
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
  paddingBottom: "$4",
  display: "grid",
  gap: "$4",

  "@small": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  "@medium": {
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "$5",
  },

  "@large": {
    gap: "40px",
  },
});

const Products: React.FunctionComponent<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
  images: { id: number; images: { paths: string[]; blurDataURLs: string[] } }[];
  meta: Tmeta;
}> = ({ products, images, meta }) => {
  return (
    <>
      <NextSeo
        title={meta.headline}
        description={meta.subheadline}
        openGraph={{
          type: "website",
          title: meta.headline,
          description: meta.subheadline,
          site_name: meta.name,
        }}
      />
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
      <Footer {...meta} />
    </>
  );
};

// @ts-ignore
Products.layout = Layout;

export default Products;
