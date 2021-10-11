/**
 * @jest-environment jsdom
 */

/**
 * This test file should test the shipping option feature.
 * Currently, there are three scenarios to be tested:
 *
 * 1. A product needs shipping
 * 2. A product doesn't need shipping
 * 3. Shipping costs are set to $0.00 because of isFreeFrom attribute
 */

import React from "react";
import { render } from "@testing-library/react";
import CartPage, { getStaticProps } from "../../pages/cart";
import { Tmeta } from "../../types";

import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../../lib/cart";

const prisma = new PrismaClient();

let products: Map<
  "productWithShipping" | "productWithoutShipping" | "productHasFreeShipping",
  Required<Prisma.ProductUncheckedCreateInput>
> = new Map();

const TestWrapper: React.FunctionComponent<{
  product: Required<Prisma.ProductUncheckedCreateInput>;
}> = ({ children, product }) => {
  const { cart, addItem } = useCartStore();

  React.useEffect(() => {
    addItem({ ...product, images: [] }, cart);
  }, [product, cart, addItem]);

  return <>{children}</>;
};

beforeAll(() => {
  // Otherwise useEffect hooks won't work: https://github.com/testing-library/react-testing-library/issues/215
  jest.spyOn(React, "useEffect").mockImplementation(React.useLayoutEffect);

  return new Promise(async (resolve) => {
    const productWithShipping = await prisma.product.findFirst({
      where: {
        needsShipping: {
          equals: true,
        },
      },
      include: {
        brand: true,
      },
    });

    const productWithoutShipping = await prisma.product.findFirst({
      where: {
        needsShipping: {
          equals: false,
        },
      },
      include: {
        brand: true,
      },
    });

    const productHasFreeShipping = await prisma.product.findFirst({
      where: {
        price: {
          gt: 10000,
        },
        needsShipping: {
          equals: true,
        },
      },
      include: {
        brand: true,
      },
    });

    products.set(
      "productWithShipping",
      productWithShipping as unknown as Required<Prisma.ProductUncheckedCreateInput>
    );
    products.set(
      "productWithoutShipping",
      productWithoutShipping as unknown as Required<Prisma.ProductUncheckedCreateInput>
    );
    products.set(
      "productHasFreeShipping",
      productHasFreeShipping as unknown as Required<Prisma.ProductUncheckedCreateInput>
    );

    resolve(products);
  });
});

// @ts-ignore
afterAll(() => React.useEffect.mockRestore());

describe("Test shipping methods", () => {
  it("should not show shipping options (product doesn't need shipping).", async () => {
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
      <CartPage
        {...(props as unknown as {
          meta: Tmeta;
          shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
        })}
      />,
      {
        wrapper: (props) => (
          <TestWrapper
            {...props}
            product={products.get("productWithoutShipping")!}
          ></TestWrapper>
        ),
      }
    );

    const shippingOption = queryByText("Free Shipping");

    expect(shippingOption).not.toBeInTheDocument();
  });

  it("should show shipping options with 0.00 as price.", async () => {
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

    const { queryAllByText } = render(
      <CartPage
        {...(props as unknown as {
          meta: Tmeta;
          shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
        })}
      />,
      {
        wrapper: (props) => (
          <TestWrapper
            {...props}
            product={products.get("productHasFreeShipping")!}
          ></TestWrapper>
        ),
      }
    );

    const shippingOptionPrice = queryAllByText("$ 0.00");
    expect(shippingOptionPrice[0]).toBeInTheDocument();
  });

  it("should show shipping options (product needs shipping).", async () => {
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
      <CartPage
        {...(props as unknown as {
          meta: Tmeta;
          shippingOptions: Required<Prisma.ShippingCodeUncheckedCreateInput>[];
        })}
      />,
      {
        wrapper: (props) => (
          <TestWrapper
            {...props}
            product={products.get("productWithShipping")!}
          ></TestWrapper>
        ),
      }
    );

    const shippingOption = queryByText("Free Shipping");

    expect(shippingOption).toBeInTheDocument();
  });
});
