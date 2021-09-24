import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import Cart from "../../components/Cart";

const prisma = new PrismaClient();

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Get all products with
   * availability !== notVisible
   */
  const allVisibleProducts = await prisma.product.findMany({
    select: { slug: true },
    where: {
      availability: {
        not: "notVisible",
      },
    },
  });

  return {
    paths: allVisibleProducts.map((product) => ({
      params: {
        slug: product.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  /**
   * Get the first product with
   * params.slug === product.slug
   */
  const product = await prisma.product.findFirst({
    where: {
      slug: {
        equals: params!.slug as string,
      },
    },
  });

  /**
   * Get all images for this product that are place under /public/products/[id]
   */

  if (product) {
    const imagesDirectory = path.join(
      process.cwd(),
      `public/products/${product.id}`
    );
    const productImagePaths = await fs.readdir(imagesDirectory);

    return {
      props: {
        product: {
          ...product,
          // Date objects needs to be converted to strings because the props object will be serialized as JSON
          createdAt: product?.createdAt.toString(),
          updatedAt: product?.updatedAt.toString(),
        },
        productImagePaths: productImagePaths.map(
          (path) => `/products/${product.id}/${path}`
        ),
      },
    };
  } else return { props: {} };
};

const ProductPage = ({
  product,
  productImagePaths,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Cart />
      <span>{product.id}</span>
      <span>{product.name}</span>
      <div>
        {productImagePaths.map((imagePath: string) => (
          <div
            key={imagePath}
            style={{ width: "400px", height: "400px", position: "relative" }}
          >
            <Image
              src={imagePath}
              layout="fill"
              objectFit="cover"
              alt={imagePath}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
