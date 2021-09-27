import Link from "next/link";
import { styled, Box } from "../stitches.config";
import { Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";

const Wrapper = styled("div", {
  boxShadow:
    "0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)",
  borderRadius: "20px",
  padding: "$4",
  display: "flex",
  background: "$crimson1",
});

const ProductName = styled("h1", {
  all: "unset",
  fontSize: "$3",
  lineHeight: "30px",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductPrice = styled("div", {
  fontSize: "$3",
  lineHeight: "30px",
  color: "$mauve12",
  fontFamily: "Work Sans, sans-serif",
});

const ProductDescription = styled("p", {
  color: "$mauve11",
});

const CountButton = styled("button", {
  all: "unset",
  width: 25,
  height: 25,
  background: "$mauve3",
  color: "$mauve10",
  borderRadius: "$small",
  display: "inline-grid",
  placeContent: "center",
});

const ProductCart: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput> & { count?: number };
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
      <Link href={`/products/${product.slug}`} passHref>
        <a>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>
            {currencyCodeToSymbol(product.currency)} {product.price / 100}
          </ProductPrice>
        </a>
      </Link>
      <Box
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
      </Box>
    </Wrapper>
  );
};

export default ProductCart;
