import Link from "next/link";
import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import { HomeIcon, ArchiveIcon, GearIcon } from "@modulz/radix-icons";

const Wrapper = styled("div", {
  paddingLeft: "$4",
  marginLeft: "-$4",
  paddingRight: "$4",
  marginRight: "-$4",
  borderBottom: "1px solid $mauve4",
  borderTop: "1px solid $mauve4",
});

const MenuBarBox = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow:
    "0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)",
  background: "$mauve1",

  "&>svg": {
    cursor: "pointer",
    color: "$mauve11",
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

const Item = styled("div", {
  flex: 1,
  display: "grid",
  placeContent: "center",
  borderRight: "1px solid $mauve4",
  padding: "$4",
});

const MenuBar: React.FunctionComponent = () => {
  const { cart } = useCartStore();

  return (
    <Wrapper>
      <MenuBarBox>
        <Link href="/" passHref>
          <Item as="a">
            <HomeIcon />
          </Item>
        </Link>
        <Link href="/cart" passHref>
          <Item as="a">
            <Box css={{ position: "relative" }}>
              <CartSizeIcon>{cart.size}</CartSizeIcon>
              <ArchiveIcon />
            </Box>
          </Item>
        </Link>
        <Item>
          <GearIcon />
        </Item>
      </MenuBarBox>
    </Wrapper>
  );
};

export default MenuBar;
