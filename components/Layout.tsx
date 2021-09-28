import { styled, Box } from "../stitches.config";
import Footer from "./Footer";
import MenuBar from "./MenuBar";

const LayoutWrapper = styled("div", {
  height: "100vh",
  background: "$mauve1",
});

const PageWrapper = styled("div", {
  margin: "0 $4",
  borderLeft: "1px solid $mauve4",
  borderRight: "1px solid $mauve4",
});

const Border = styled("div", {
  border: "1px solid $mauve1",
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
      <PageWrapper>
        <Border>{children}</Border>
        <MenuBar />
        <Footer />
      </PageWrapper>
    </LayoutWrapper>
  );
};

export default Layout;
