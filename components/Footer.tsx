import { styled } from "../stitches.config";

const Wrapper = styled("footer", {
  padding: "$4",
});

const Footer = () => {
  return (
    <Wrapper>
      <strong>Teini</strong>
      <p>
        Teini is a minimal opensource ecommerce system. It only needs to be
        deployed and a valid Stripe account. See how it works here:{" "}
        <a href="https://github.com/zeekrey/teini">Github</a>
      </p>
    </Wrapper>
  );
};

export default Footer;
