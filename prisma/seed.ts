import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "The Brand",
    },
  });

  const shippingCode = await prisma.shippingCode.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Free Shipping",
      description: "Free international shipping",
    },
  });

  const product = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      slug: "the-first-product",
      name: "The first product",
      description: "This is the first product description",
      price: 299,
      availability: "inStock",
      shippingCodeId: 1,
      brandId: 1,
    },
  });

  console.log({ brand, shippingCode, product });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
