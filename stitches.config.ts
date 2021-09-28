import { createStitches } from "@stitches/react";
import { crimson, crimsonDark, mauve, mauveDark } from "@radix-ui/colors";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...crimson,
      ...mauve,
    },
    shadows: {
      ...crimson,
      ...mauve,
    },
    space: {
      1: "5px",
      2: "10px",
      3: "15px",
      4: "20px",
      5: "25px",
    },
    sizes: {
      1: "5px",
      2: "10px",
      3: "15px",
      4: "20px",
      5: "25px",
    },
    fontSizes: {
      1: "12px",
      2: "13px",
      3: "15px",
      4: "22px",
      5: "28px",
    },
    radii: {
      small: "5px",
      medium: "15px",
      large: "40px",
    },
  },
  media: {
    bp1: "(min-width: 640px)",
    bp2: "(min-width: 768px)",
    bp3: "(min-width: 1024px)",
  },
  utils: {
    marginX: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
  },
});

export const darkTheme = createTheme({
  colors: {
    ...crimsonDark,
    ...mauveDark,
  },
});

export const globalStyles = globalCss({
  html: { margin: 0, padding: 0, minHeight: "100vh" },
  body: {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    fontFamily: "Roboto, sans-serif",
  },
  a: { all: "unset" },
});

export const Box = styled("div", {});
