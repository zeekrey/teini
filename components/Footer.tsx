import { styled } from "../stitches.config";
import type { Tmeta } from "../types";

const Wrapper = styled("footer", {
  padding: "$4",
});

const Footer: React.FunctionComponent<Tmeta> = ({ name, contact }) => {
  return (
    <Wrapper>
      <strong>{name}</strong>
      <p>{contact}</p>
    </Wrapper>
  );
};

export default Footer;
