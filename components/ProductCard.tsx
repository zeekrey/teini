import Link from "next/link";
import Image from "next/image";
import { styled, Box } from "../stitches.config";
import { Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import { currencyCodeToSymbol } from "../lib/stripeHelpers";
import { ArrowRightIcon } from "@modulz/radix-icons";
import Button from "../components/Button";

import PlaceholderImage from "../public/placeholder.png";

const Wrapper = styled("div", {
  display: "flex",
  background: "$crimson1",

  a: {
    flex: 1,
  },
});

const ProductName = styled("div", {
  fontFamily: "Work Sans, sans serif",
  color: "$crimson12",
  fontSize: "22px",
});

const ProductPrice = styled("div", {
  display: "grid",
  placeContent: "center",
});

const ProductBrand = styled("div", {
  color: "$crimson10",
});

const ImageContainer = styled("div", {
  position: "relative",
  height: "240px",
  width: "100%",
});

const ProductCard: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput>;
  images?: { id: number; paths: string[] };
}> = ({ product, images }) => {
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
          <Box
            css={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "$1",
              paddingBottom: "$1",
              paddingLeft: "$4",
              marginLeft: "-$4",
              paddingRight: "$4",
              marginRight: "-$4",
              borderBottom: "1px solid $mauve4",
              borderTop: "1px solid $mauve4",
            }}
          >
            <div>
              <ProductBrand>{product.brandId}</ProductBrand>
              <ProductName>{product.name}</ProductName>
            </div>
            <ProductPrice>
              {currencyCodeToSymbol(product.currency)} {product.price / 100}
            </ProductPrice>
          </Box>
        </a>
      </Link>
    </Wrapper>
  );
};

export default ProductCard;
