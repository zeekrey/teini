/**
 * @jest-environment jsdom
 */

/**
 * This test file should test the cart feature.
 * Currently, there are three scenarios to be tested:
 *
 * 1. Add a product to cart
 * 2. Change amount of a product in cart
 * 3. Remove product
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CartPage, { getStaticProps } from "../../pages/cart";
import { Tmeta } from "../../types";

import { PrismaClient, Prisma } from "@prisma/client";
import { useCart, CartProvider } from "../../lib/cart";

const prisma = new PrismaClient();

let product: null | Required<Prisma.ProductUncheckedCreateInput>;

const TestWrapper: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput>;
}> = ({ children, product }) => {
  const { cart, dispatch } = useCart();

  React.useEffect(() => {
    dispatch({
      type: "addItem",
      item: { product: product, images: [], count: 1 },
    });
  }, []);

  return <>{children}</>;
};

beforeAll(() => {
  // Otherwise useEffect hooks won't work: https://github.com/testing-library/react-testing-library/issues/215
  jest.spyOn(React, "useEffect").mockImplementation(React.useLayoutEffect);

  return new Promise(async (resolve) => {
    const _product = await prisma.product.findFirst({
      where: {
        name: {
          equals: "The first product",
        },
      },
      include: {
        brand: true,
      },
    });

    product = _product;

    resolve(product);
  });
});

// @ts-ignore
afterAll(() => React.useEffect.mockRestore());

describe("Test cart", () => {
  it("should add a product to cart", async () => {
    /**
     * Get the actual cart page props.
     */
    const { props } = (await getStaticProps({
      params: undefined,
    })) as unknown as {
      props: {
        meta: Tmeta;
        shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
      };
    };

    const { queryByText } = render(
      <TestWrapper {...props} product={product!}>
        <CartPage
          {...(props as unknown as {
            meta: Tmeta;
            shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
          })}
        />
      </TestWrapper>,
      {
        wrapper: (props) => <CartProvider {...props} />,
      }
    );

    const productContainer = queryByText("The first product");
    expect(productContainer).toBeInTheDocument();
  });

  it("should add a product of same type (count++)", async () => {
    /**
     * Get the actual cart page props.
     */
    const { props } = (await getStaticProps({
      params: undefined,
    })) as unknown as {
      props: {
        meta: Tmeta;
        shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
      };
    };

    const { getByText, getByTestId } = render(
      <TestWrapper {...props} product={product!}>
        <CartPage
          {...(props as unknown as {
            meta: Tmeta;
            shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
          })}
        />
      </TestWrapper>,
      {
        wrapper: (props) => <CartProvider {...props} />,
      }
    );

    fireEvent.click(getByText("+"));

    const productCount = getByTestId("productCount");
    expect(productCount.textContent).toEqual("2");
  });

  it("should remove a product of same type (count--)", async () => {
    /**
     * Get the actual cart page props.
     */
    const { props } = (await getStaticProps({
      params: undefined,
    })) as unknown as {
      props: {
        meta: Tmeta;
        shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
      };
    };

    const { getByText, queryByText } = render(
      <TestWrapper {...props} product={product!}>
        <CartPage
          {...(props as unknown as {
            meta: Tmeta;
            shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
          })}
        />
      </TestWrapper>,
      {
        wrapper: (props) => <CartProvider {...props} />,
      }
    );

    fireEvent.click(getByText("-"));

    // product shouldn't be visibile because count === 0
    const productContainer = queryByText("The first product");
    expect(productContainer).not.toBeInTheDocument();
  });
});
