# Teini

## ToDos:

- [x] Setup product database
- [x] Add tests for product database
- [x] View product
- [x] Cart
- [] Add tests for Cart
- [x] Checkout
- [x] Handle product images
- [] Handle currancy code
- [] Change price to integer in cent
- [] Style
- [] Add npm script to add db
- [] Add wishlist feature
- [] Add share feature
- [] Seo

Dummy Product photos
Photo by <a href="https://unsplash.com/@boxedwater?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Boxed Water Is Better</a> on <a href="https://unsplash.com/@boxedwater?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

## Docs

- Create sqlite db:
- - You'll need sqlite3: https://www.sqlite.org/download.html
- - Create the products.db `sqlite3 test.db`
- - Install prisma, run npx prisma and npx prisma init

- Run tests.
- Should have at least one product (see productsDb.test.ts)

To add new db changes during prototyping
npx prisma db push
npx prisma db push --force-reset (to reset the db)
npx prisma db seed
