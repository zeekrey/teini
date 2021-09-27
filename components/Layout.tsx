import { styled } from "../stitches.config";

const Wrapper = styled("div", {
  height: "100vh",
  background:
    "radial-gradient(circle at top left, $crimson3, rgba(255, 255, 255, 0) 30%), radial-gradient(circle at bottom right, $crimson3, rgba(255, 255, 255, 0) 30%)",
});

const Layout: React.FunctionComponent = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;
