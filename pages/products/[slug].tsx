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
  } else return { props: {} };
};

const ImageContainer = styled("div", {
  height: "54vh",
  position: "relative",
  // borderBottomRightRadius: "$large",
  // borderBottomLeftRadius: "$large",
  // overflow: "hidden",
  // filter: "drop-shadow(0 0 30px var(--shadows-crimson7))",
});

const Container = styled("main", {
  padding: "$5",
});

const ProductName = styled("h1", {
  all: "unset",
  fontSize: "$4",
  lineHeight: "30px",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductPrice = styled("div", {
  fontSize: "$4",
  lineHeight: "30px",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductBrand = styled("div", {
  color: "$mauve8",
});

const ProductDescription = styled("p", {
  color: "$mauve11",
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
    console.log("Adding product...");
    addItem(product, cart);
  };

  return (
    <MenuBar>
      <ImageContainer>
        <Image
          src={productImagePaths[0]}
          layout="fill"
          objectFit="cover"
          alt={productImagePaths[0]}
        />
      </ImageContainer>
      {/* <Cart /> */}
      <Container>
        <Box
          css={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <ProductName>{product.name}</ProductName>
          <ProductPrice>
            {currencyCodeToSymbol(product.currency)} {product.price / 100}
          </ProductPrice>
        </Box>
        <ProductBrand>{product.brandId}</ProductBrand>
        <ProductDescription>{product.description}</ProductDescription>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </Container>
      {/* <div>
        {productImagePaths.map((imagePath: string) => (
          <div
            key={imagePath}
            style={{ width: "400px", height: "400px", position: "relative" }}
          >
            <Image
              src={imagePath}
              layout="fill"
              objectFit="cover"
              alt={imagePath}
            />
          </div>
        ))}
      </div> */}
    </MenuBar>
  );
};

// @ts-ignore
ProductPage.layout = Layout;

export default ProductPage;
