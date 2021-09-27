import Link from "next/link";
import Image from "next/image";
import { styled, Box } from "../stitches.config";
import { Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import { ArrowRightIcon } from "@modulz/radix-icons";

import PlaceholderImage from "../public/placeholder.png";

const Wrapper = styled("div", {
  // boxShadow:
  //   "0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)",
  // borderRadius: "20px",
  // padding: "$4",
  display: "flex",
  background: "$crimson1",

  a: {
    flex: 1,
  },
});

const ProductName = styled("h1", {
  all: "unset",
  fontSize: "$3",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductPrice = styled("div", {
  fontSize: "$2",
  lineHeight: "30px",
  color: "$mauve10",
  fontFamily: "Roboto, sans-serif",
});

const SeeProductButton = styled("button", {
  all: "unset",
  width: 25,
  height: 25,
  background: "$mauve3",
  color: "$mauve10",
  borderRadius: "9999px",
  display: "inline-grid",
  placeContent: "center",
});

const ImageContainer = styled("div", {
  position: "relative",
  height: "240px",
  width: "100%",
  borderRadius: "$large",
  overflow: "hidden",
});

const ProductCard: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput>;
  images?: { id: number; paths: string[] };
}> = ({ product, images }) => {
  const { cart, addItem, removeItem } = useCartStore();

  const handleAddItem = () => {
    addItem(product, cart);
  };

  const handleRemoveItem = () => {
    removeItem(product, cart);
  };
  return (
    <Wrapper>
      <Link href={`/products/${product.slug}`} passHref>
        <a>
          <ImageContainer>
            {images ? (
              <Image
                src={images.paths[0]}
                layout="fill"
                objectFit="cover"
                alt={images.paths[0]}
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
          <Box css={{ display: "flex", alignItems: "center" }}>
            <Box css={{ padding: "0 $2" }}>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>
                {currencyCodeToSymbol(product.currency)} {product.price / 100}
              </ProductPrice>
            </Box>
            <div>
              <SeeProductButton>
                <ArrowRightIcon />
              </SeeProductButton>
            </div>
          </Box>
        </a>
      </Link>
      {/* <Box
        css={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <CountButton onClick={handleRemoveItem}>-</CountButton>
        <Box css={{ textAlign: "center" }}>{product.count}</Box>
        <CountButton onClick={handleAddItem}>+</CountButton>
      </Box> */}
    </Wrapper>
  );
};

export default ProductCard;
