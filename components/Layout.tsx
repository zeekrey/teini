import { styled, Box } from "../stitches.config";
import Footer from "./Footer";
import MenuBar from "./MenuBar";
import type { Tmeta } from "../types";

const LayoutWrapper = styled("div", {
  height: "100vh",
  background: "$mauve1",
});

const PageWrapper = styled("div", {
  margin: "0 $4",
  borderLeft: "1px solid $mauve4",
  borderRight: "1px solid $mauve4",
});

const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <LayoutWrapper>
      <Box
        css={{
          height: "$4",
        }}
      >
        <Box
          css={{
            margin: "0 $4",
            height: "$4",
            borderLeft: "1px solid $mauve4",
            borderRight: "1px solid $mauve4",
          }}
        />
      </Box>
      <PageWrapper>{children}</PageWrapper>
    </LayoutWrapper>
  );
};

export default Layout;
