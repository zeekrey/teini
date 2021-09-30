import { styled, Box } from "../stitches.config";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchGetJSON } from "../lib/fetcher";
import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import MenuBar from "../components/MenuBar";
import { useCartStore } from "../lib/cart";
import { Tmeta } from "../types";
import Footer from "../components/Footer";
import SuccessImage from "../public/jason-dent-WNVGLwGMCAg-unsplash.jpg";
import PageHeadline from "../components/PageHeadline";

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

const Subheadline = styled("h1", {
  fontFamily: "Roboto, sans serif",
  fontSize: "18px",
  fontWeight: "normal",
  color: "$mauve9",
});

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

  return {
    props: {
      meta: {
        headline,
        subheadline,
        contact,
        name,
      },
    },
  };
};

const Confirmation: NextPage<{ meta: Tmeta }> = ({ meta }) => {
  const { clearCart } = useCartStore();
  const router = useRouter();

  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  useEffect(() => {
    // If checkout is completed, the cart should be cleared.
    clearCart();
  }, [clearCart]);

  /**
   * Data for buyer
   * data.payment_intent.charges.data[0].billing_details.email
   * data.payment_intent.charges.data[0].billing_details.name
   *
   */

  /**
   * Data for seller
   * data.payment_intent
   */

  // console.log(data.payment_intent);

  return (
    <LayoutWrapper>
      <NextSeo noindex={true} />
      <ImageContainer>
        <Image
          src={SuccessImage}
          layout="fill"
          objectFit="cover"
          alt="success image"
          placeholder="blur"
        />
      </ImageContainer>
      <Box as="main" css={{ paddingBottom: "$3" }}>
        <PageHeadline>
          {error && <span>Your payment could not be verified.</span>}
          {data && <span>Awesome! That worked!</span>}
        </PageHeadline>
        <Subheadline>
          This is your order reference: <strong>{data.payment_intent.id}</strong>
        </Subheadline>
      </Box>
      <MenuBar />
      <Footer {...meta} />
    </LayoutWrapper>
  );
};

// @ts-ignore
// Confirmation.layout = Layout;

export default Confirmation;
