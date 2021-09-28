# Teini

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzeekrey%2Fteini&env=STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=Stripe&envLink=https%3A%2F%2Fteini.co%2F&redirect-url=https%3A%2F%2Fteini.co%2F&demo-title=Teini%20Demo&demo-description=This%20is%20the%20demo%20description&demo-url=https%3A%2F%2Fteini.co%2F)


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
