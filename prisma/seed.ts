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

  const shippingCode1 = await prisma.shippingCode.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Standard Shipping",
      description: "Standard international shipping",
      price: 299,
      isFreeFrom: 1000,
    },
  });

  const shippingCode2 = await prisma.shippingCode.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Express Shipping",
      description: "Express international shipping",
      price: 699,
      isFreeFrom: 10000,
    },
  });

  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      slug: "the-first-product",
      name: "The first product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 299,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: true,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      slug: "the-second-product",
      name: "The second product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 2999,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: true,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      slug: "the-third-product",
      name: "The third product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 29999,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: true,
    },
  });

  const product4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      slug: "the-fourth-product",
      name: "The fourth product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 1,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: false,
    },
  });

  const product5 = await prisma.product.upsert({
    where: { id: 5 },
    update: {},
    create: {
      slug: "the-fifth-product",
      name: "The fifth product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 1182,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: false,
    },
  });

  const product6 = await prisma.product.upsert({
    where: { id: 6 },
    update: {},
    create: {
      slug: "the-sixth-product",
      name: "The sixth product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 1000,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: false,
    },
  });

  const product7 = await prisma.product.upsert({
    where: { id: 7 },
    update: {},
    create: {
      slug: "the-seventh-product",
      name: "The seventh product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      price: 9999,
      currency: "usd",
      availability: "inStock",
      brandId: 1,
      needsShipping: false,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
