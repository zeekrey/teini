import "@testing-library/jest-dom/extend-expect";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // Use div instead of img tag. Img tag would require props.
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <div />;
  },
}));
