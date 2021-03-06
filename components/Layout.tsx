import { styled, Box } from "../stitches.config";

const LayoutWrapper = styled("div", {
  background: "$mauve1",

  "@small": {
    padding: "10% 10%",
  },

  "@medium": {
    padding: "10% 15%",
  },

  "@large": {
    padding: "5% 20%",
  },
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
