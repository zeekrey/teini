import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

test("product.db should have at least one product", async () => {
  const allProducts = await prisma.product.findMany();

  expect(allProducts.length).toBeGreaterThan(0);
});

test("product.db should have at least one product in stock", async () => {
  const productsInStock = await prisma.product.findMany({
    where: { availability: "inStock" },
  });

  expect(productsInStock.length).toBeGreaterThan(0);
});
