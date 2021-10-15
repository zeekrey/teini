import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import Button from "../../components/Button";
import MenuBar from "../../components/MenuBar";
import { styled, Box } from "../../stitches.config";
import { useCart } from "../../lib/cart";
import { currencyCodeToSymbol } from "../../lib/stripeHelpers";
import PlaceholderImage from "../../public/placeholder.png";
import { Tmeta } from "../../types";
import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import { getPlaiceholder } from "plaiceholder";

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
    include: {
      brand: true,
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
  paddingTop: "$4",
});

const ProductDescription = styled("p", {
  color: "$crimson11",
  fontSize: "16px",
  lineHeight: "24px",
});

const AnimatedImage = styled(Image, {
  transition: ".3s",
});

const LayoutWrapper = styled("div", {
  background: "$mauve1",
  padding: "$4",

  "@small": {
    padding: "10% 10%",
  },

  "@medium": {
    padding: "10% 15%",
  },

  "@large": {
    padding: "5% 25%",
  },
});

const ProductPage: NextPage<{
  product: Required<
    Prisma.ProductUncheckedCreateInput & {
      brand: Prisma.BrandUncheckedCreateInput;
    }
  >;
  images: { path: string; blurDataURL: string }[];
  meta: Tmeta;
}> = ({ product, images, meta }) => {
  const { cart, dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: "addItem",
      item: { product: product, images: [...images], count: 1 },
    });
  };

  return (
    <LayoutWrapper>
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
      <Box as="main" css={{ paddingBottom: "$3" }}>
        <ProductBrand>{product.brand.name}</ProductBrand>
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
      <pre>{JSON.stringify(cart)}</pre>
      <Footer {...meta} />
    </LayoutWrapper>
  );
};

export default ProductPage;
