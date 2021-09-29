# Teini

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzeekrey%2Fteini&env=STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,SHOP_NAME,SHOP_CONTACT,SHOP_HEADLINE,SHOP_SUBHEADLINE&envDescription=You'll%20need%20Stripe%20API%20key.&envLink=https%3A%2F%2Fstripe.com%2Fdocs%2Fkeys&project-name=teini-copy&repo-name=teini-copy&redirect-url=https%3A%2F%2Fkrey.io&demo-title=Teini%20-%20The%20smallest%20eShop%20in%20the%20world&demo-description=A%20real%20online%20store.%20But%20without%20the%20costs%20and%20without%20complexity.&demo-url=https%3A%2F%2Fteini.co&demo-image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1494256997604-768d1f608cac%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1829%26q%3D80)


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
