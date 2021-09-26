import Link from "next/link";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import { HomeIcon, ArchiveIcon, GearIcon } from "@modulz/radix-icons";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
});

const Child = styled("div", {
  flex: "1 0 auto",
});

const MenuBarContainer = styled("div", {
  flexShrink: 0,
});

const MenuBarBox = styled("div", {
  margin: "$3",
  padding: "$4 $5",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow:
    "0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)",
  borderRadius: "25px",
  background: "$mauve1",

  svg: {
    cursor: "pointer",
    color: '$mauve11',
  },
});

const CartSizeIcon = styled("div", {
  position: "absolute",
  bottom: "-4px",
  right: "-8px",
  background: "$crimson1",
  border: "1px solid $mauve5",
  width: "16px",
  height: "16px",
  fontSize: "6px",
  borderRadius: "9999px",
  display: "grid",
  placeContent: "center",
});

const MenuBar: React.FunctionComponent = ({ children }) => {
  const { cart } = useCartStore();

  return (
    <Wrapper>
      <Child>{children}</Child>
      <MenuBarContainer>
        <MenuBarBox>
          <Link href="/" passHref>
            <a>
              <HomeIcon />
            </a>
          </Link>
          <Link href="/cart" passHref>
            <Box as="a" css={{ position: "relative" }}>
              <CartSizeIcon>{cart.size}</CartSizeIcon>
              <ArchiveIcon />
            </Box>
          </Link>
          <GearIcon />
        </MenuBarBox>
      </MenuBarContainer>
    </Wrapper>
  );
};

export default MenuBar;
