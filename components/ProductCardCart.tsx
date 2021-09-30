import Link from "next/link";
import Image from "next/image";
import { styled, Box } from "../stitches.config";
import { Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import PlaceholderImage from "../public/placeholder.png";

const Wrapper = styled("div", {
  boxShadow:
    "0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)",
  borderRadius: "1px",
  display: "flex",
  background: "$crimson1",
});

const ProductName = styled("strong", {
  all: "unset",
  fontSize: "18px",
  lineHeight: "18px",
  color: "$crimson12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductPrice = styled("div", {
  fontSize: "20px",
  lineHeight: "20px",
  color: "$crimson12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductDescription = styled("p", {
  color: "$mauve10",
  fontSize: "12px",
  padding: 0,
  margin: 0,
});

const CountButton = styled("button", {
  all: "unset",
  width: 30,
  height: 30,
  background: "$mauve3",
  color: "$mauve10",
  borderRadius: "$small",
  display: "inline-grid",
  placeContent: "center",
  cursor: "pointer",

  "&:hover": {
    background: "$mauve4",
  },

  "&:focus": {
    boxShadow: "0px 0px 2px 0px $mauve10",
  },
});

const ImageContainer = styled("a", {
  all: "unset",
  position: "relative",
  height: "130px",
  width: "110px",
  cursor: "pointer",
});

const ProductCardCart: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput> & {
    count?: number;
    images: { path: string; blurDataURL: string }[];
  };
}> = ({ product }) => {
  const { cart, addItem, removeItem } = useCartStore();

  const handleAddItem = () => {
    addItem(product, cart);
  };

  const handleRemoveItem = () => {
    removeItem(product, cart);
  };
  return (
    <Wrapper>
      <Box css={{ display: "flex", flex: 1 }}>
        <Link href={`/products/${product.slug}`} passHref>
          <ImageContainer>
            {product.images.length ? (
              <Image
                src={product.images[0].path}
                layout="fill"
                objectFit="cover"
                alt={product.images[0].path}
                placeholder="blur"
                blurDataURL={product.images[0].blurDataURL}
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
        </Link>
        <Box css={{ padding: "$3", display: "flex", flex: 1 }}>
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginRight: "$2",
            }}
          >
            <ProductName>{product.name}</ProductName>
            <ProductDescription>
              {product.description.substr(0, 40)}...
            </ProductDescription>
            <ProductPrice>
              {currencyCodeToSymbol(product.currency)} {product.price / 100}
            </ProductPrice>
          </Box>
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CountButton onClick={handleAddItem}>+</CountButton>
            <Box css={{ textAlign: "center" }}>{product.count}</Box>
            <CountButton onClick={handleRemoveItem}>-</CountButton>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default ProductCardCart;
