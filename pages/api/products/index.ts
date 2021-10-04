import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getPlaiceholder } from "plaiceholder";
import path from "path";

import { promises as fs } from "fs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const page = (req.query.page as string) || "0";

    const pageSize = 3;

    const results = await prisma.product.findMany({
      where: {
        availability: {
          not: "notVisible",
        },
      },
      include: {
        brand: true,
      },
      skip: pageSize * parseInt(page),
      take: pageSize,
    });

    let allImagePaths = [];

    for (const product of results) {
      const imagesDirectory = path.join(
        process.cwd(),
        `public/products/${product.id}`
      );

      try {
        const productImagePaths = await fs.readdir(imagesDirectory);

        const blurDataURLs = await Promise.all(
          productImagePaths.map(async (src) => {
            const { base64 } = await getPlaiceholder(
              `/products/${product.id}/${src}`
            );
            return base64;
          })
        ).then((values) => values);

        allImagePaths.push({
          id: product.id,
          images: {
            paths: productImagePaths.map(
              (path) => `/products/${product.id}/${path}`
            ),
            blurDataURLs: blurDataURLs,
          },
        });
      } catch (error) {
        console.warn(
          `Image ${product.name} has no images under /public/product/[id]!`
        );
      }
    }
    res.status(200).json(
      JSON.stringify({
        products: results.map((product) => ({
          ...product,
          // Date objects needs to be converted to strings because the props object will be serialized as JSON
          createdAt: product.createdAt.toString(),
          updatedAt: product.updatedAt.toString(),
        })),
        images: await Promise.all(allImagePaths),
      })
    );
  } else {
    // 501 Not Implemented
    res.status(501).end();
  }
}
