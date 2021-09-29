import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import Button from "../../components/Button";
import MenuBar from "../../components/MenuBar";
import Layout from "../../components/Layout";
import { styled, Box } from "../../stitches.config";
import { useCartStore } from "../../lib/cart";
import { currencyCodeToSymbol } from "../../lib/stripeHelpers";
import PlaceholderImage from "../../public/placeholder.png";
import { Tmeta } from "../../types";
import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import { getPlaiceholder } from "plaiceholder";
import { useState } from "react";

const prisma = new PrismaClient();

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Get all products with
   * availability !== notVisible
   */
  const allVisibleProducts = await prisma.product.findMany({
    select: { slug: true },
    where: {
      availability: {
        not: "notVisible",
      },
    },
  });

  return {
    paths: allVisibleProducts.map((product) => ({
      params: {
        slug: product.slug,
      },
    })),
    fallback: false,
  };
};

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
   * Get the first product with
   * params.slug === product.slug
   */
  const product = await prisma.product.findFirst({
    where: {
      slug: {
        equals: params!.slug as string,
      },
    },
  });

  /**
   * Get all images for this product that are place under /public/products/[id]
   */

  if (product) {
    const imagesDirectory = path.join(
      process.cwd(),
      `public/products/${product.id}`
    );

    try {
      const productImagePaths = await fs.readdir(imagesDirectory);

      console.log(productImagePaths)

      /**
       * Create blurDataURLs (base64) as image placeholders
       */

      const blurDataURLs = await Promise.all(
        productImagePaths.map(async (src) => {
          const { base64 } = await getPlaiceholder(
            `/products/${product.id}/${src}`
          );
          return base64;
        })
      ).then((values) => values);

      return {
        props: {
          product: {
            ...product,
            // Date objects needs to be converted to strings because the props object will be serialized as JSON
            createdAt: product?.createdAt.toString(),
            updatedAt: product?.updatedAt.toString(),
          },
          images: productImagePaths.map((path, index) => ({
            path: `/products/${product.id}/${path}`,
            blurDataURL: blurDataURLs[index],
          })),
          meta: {
            headline,
            subheadline,
            contact,
            name,
          },
        },
      };
    } catch (error) {
      console.warn(
        `Image ${product.name} has no images under /public/product/[id]!`
      );
      console.error(error);
      return {
        props: {
          product: {
            ...product,
            // Date objects needs to be converted to strings because the props object will be serialized as JSON
            createdAt: product?.createdAt.toString(),
            updatedAt: product?.updatedAt.toString(),
          },
          images: [],
          meta: {
            headline,
            subheadline,
            contact,
            name,
          },
        },
      };
    }
  } else return { props: {} };
};

const ImageContainer = styled("div", {
  height: "54vh",
  position: "relative",
  marginLeft: "calc($4*-1)",
  marginRight: "calc($4*-1)",
  marginTop: "calc($4*-1)",

  transition: "1s",
});

const ProductName = styled("h1", {
  all: "unset",
  fontSize: "$4",
  lineHeight: "30px",
  color: "$crimson12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductPrice = styled("div", {
  fontSize: "$4",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
  display: "grid",
  placeContent: "center",
});

const ProductBrand = styled("div", {
  color: "$mauve8",
});

const ProductDescription = styled("p", {
  color: "$crimson11",
  fontSize: "16px",
});

const AnimatedImage = styled(Image, {
  transition: ".3s",
});

const ProductPage: NextPage<{
  product: Required<Prisma.ProductUncheckedCreateInput>;
  images: { path: string; blurDataURL: string }[];
  meta: Tmeta;
}> = ({ product, images, meta }) => {
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const { cart, addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({ ...product, images: [...images] }, cart);
  };

  return (
    <>
      <NextSeo
        title={`${product.name} - ${meta.headline}`}
        description={product.description}
        openGraph={{
          type: "website",
          title: `${product.name} - ${meta.headline}`,
          description: product.description,
          site_name: meta.name,
        }}
      />
      <ImageContainer>
        {images.length ? (
          <AnimatedImage
            src={images[0].path}
            layout="fill"
            objectFit="cover"
            alt={images[0].path}
            placeholder="blur"
            blurDataURL={images[0].blurDataURL}
          />
        ) : (
          <Image
            src={PlaceholderImage}
            layout="fill"
            objectFit="cover"
            alt="placeholder"
          />
        )}
      </ImageContainer>
      <Box as="main" css={{ paddingBottom: "$4" }}>
        <ProductBrand>{product.brandId}</ProductBrand>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        <Box
          css={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "$4",
            marginLeft: "-$4",
            paddingRight: "$4",
            marginRight: "-$4",
            borderBottom: "1px solid $mauve4",
            borderTop: "1px solid $mauve4",
          }}
        >
          <ProductPrice>
            {currencyCodeToSymbol(product.currency)} {product.price / 100}
          </ProductPrice>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </Box>
      </Box>
      <MenuBar />
      <Footer {...meta} />
    </>
  );
};

// @ts-ignore
ProductPage.layout = Layout;

export default ProductPage;
