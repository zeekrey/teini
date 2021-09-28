import { GetStaticPaths, GetStaticProps } from "next";
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

      return {
        props: {
          product: {
            ...product,
            // Date objects needs to be converted to strings because the props object will be serialized as JSON
            createdAt: product?.createdAt.toString(),
            updatedAt: product?.updatedAt.toString(),
          },
          productImagePaths: productImagePaths.map(
            (path) => `/products/${product.id}/${path}`
          ),
        },
      };
    } catch (error) {
      console.warn(
        `Image ${product.name} has no images under /public/product/[id]!`
      );
      return {
        props: {
          product: {
            ...product,
            // Date objects needs to be converted to strings because the props object will be serialized as JSON
            createdAt: product?.createdAt.toString(),
            updatedAt: product?.updatedAt.toString(),
          },
          productImagePaths: [],
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

const ProductPage = ({
  product,
  productImagePaths,
}: {
  product: Required<Prisma.ProductUncheckedCreateInput>;
  productImagePaths: string[];
}) => {
  const { cart, addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({ ...product, images: [...productImagePaths] }, cart);
  };

  return (
    <>
      <ImageContainer>
        {productImagePaths.length ? (
          <Image
            src={productImagePaths[0]}
            layout="fill"
            objectFit="cover"
            alt={productImagePaths[0]}
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
    </>
  );
};

// @ts-ignore
ProductPage.layout = Layout;

export default ProductPage;
