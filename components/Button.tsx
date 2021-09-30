import { styled } from "../stitches.config";

const Button = styled("button", {
  all: "unset",
  background: "$crimson3",
  fontFamily: "Work Sans, sans serif",
  color: "$crimson11",
  padding: "18px 24px",
  borderRadius: "1px",
  fontSize: "$3",
  cursor: "pointer",
  boxShadow:
    "0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)",

  "&:hover": {
    background: "$crimson4",
  },

  "&:focus": {
    boxShadow: "0px 0px 2px 0px $crimson11",
  },
});

export default Button;
