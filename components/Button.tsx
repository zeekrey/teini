import { styled, keyframes } from "../stitches.config";

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

  '&:disabled': {
    background: '$crimson2',
    color: '$crimson6',
    cursor: 'wait'
  }
});

export const Loading = () => {
  const skBouncedelay = keyframes({
    "0%, 80%, 100%": {
      transform: "scale(0)",
    },
    "40%": {
      transform: "scale(1.0)",
    },
  });
  const Spinner = styled("div", {
    textAlign: "center",
    margin: '0 $3',

    "& > div": {
      width: " 8px",
      height: "8px",
      backgroundColor: "$crimson11",
      marginLeft: '4px',

      borderRadius: "100%",
      display: "inline-block",
      animation: `${skBouncedelay} 1.4s infinite ease-in-out both`,
    },

    "div:nth-child(1)": {
      animationDelay: "-0.32s",
    },

    "div:nth-child(2)": {
      animationDelay: "-0.16s",
    },
  });

  return (
    <Spinner>
      {[...Array(3).keys()].map((i) => (
        <div key={i} />
      ))}
    </Spinner>
  );
};

export default Button;
