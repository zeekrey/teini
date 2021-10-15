import Link from "next/link";
import Image from "next/image";
import { styled, Box } from "../stitches.config";
import { Prisma } from "@prisma/client";
import { useCart } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import PlaceholderImage from "../public/placeholder.png";

import type { CartItem } from "../lib/cart";
import { useEffect, useState, useCallback } from "react";

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
  item: CartItem;
  cart: CartItem[];
}> = ({ item }) => {
  const { cart, dispatch } = useCart();
  const { product, images } = item;

  const count = cart.find((p) => p.product.id === item.product.id)?.count ?? 0;

  const handleAddItem = () => {
    dispatch({
      type: "addItem",
      item: { product: product, images: [...(images ?? [])], count: 1 },
    });
  };

  const handleRemoveItem = () => {
    dispatch({
      type: "removeItem",
      item: { product: product, images: [...(images ?? [])], count: 1 },
    });
  };
  return (
    <Wrapper>
      <Box css={{ display: "flex", flex: 1 }}>
        <Link href={`/products/${product.slug}`} passHref>
          <ImageContainer>
            {images?.length ? (
              <Image
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
            <Box css={{ textAlign: "center" }} data-testid="productCount">
              {count}
            </Box>
            <CountButton onClick={handleRemoveItem}>-</CountButton>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default ProductCardCart;
