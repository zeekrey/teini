# Teini

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzeekrey%2Fteini&env=STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,SHOP_NAME,SHOP_CONTACT,SHOP_HEADLINE,SHOP_SUBHEADLINE&envDescription=You'll%20need%20Stripe%20API%20key.&envLink=https%3A%2F%2Fstripe.com%2Fdocs%2Fkeys&project-name=teini-copy&repo-name=teini-copy&redirect-url=https%3A%2F%2Fkrey.io&demo-title=Teini%20-%20The%20smallest%20eShop%20in%20the%20world&demo-description=A%20real%20online%20store.%20But%20without%20the%20costs%20and%20without%20complexity.&demo-url=https%3A%2F%2Fteini.co&demo-image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1494256997604-768d1f608cac%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1829%26q%3D80) 

## Installation

### ...if you're not a developer

#### Accounts needed

Running Teini should be easy and for free. Although you'll need to create some accounts to make it work:

| Account       | Description/What it does                                                   | Link                |
| ------------- | -------------------------------------------------------------------------- | ------------------- |
| Vercel        | Deploys and keeps the actual website running. It's awesome.                | https://vercel.com/ |
| Stripe        | Provides the whole checkout and payment infrastructure. It's awesome, too. | https://stripe.com  |
| Github/Gitlab | The place where the source code is stored. Awesome - yep.                  | https://github.com  |

> 🤑 While Vercel and Github should be free while respecting their fair use policies, Stripe will cost some money. Fortunately, these are transaction-dependent.

#### Environment Variables

To configure your store you need to set some meta data and credentials upfront. The following data needs to be set:

| Environment Variable               | Description                                                                                          | Default |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| STRIPE_SECRET_KEY                  | The Stripe secret key: https://stripe.com/docs/keys#obtain-api-keys                                  |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | The Stripe publishable key: https://stripe.com/docs/keys#obtain-api-keys                             |
| SHOP_NAME                          | Will show up in the browser tab and in the seo config.                                               |
| SHOP_CONTACT                       | A way customers can contact your. Could be an email or a Twitter handle. Will show up in the footer. |
| SHOP_HEADLINE                      | Will show up on the index (start) page and in the seo config.                                        |
| SHOP_SUBHEADLINE                   | Will show up on the index (start) page and in the seo config.                                        |

Once you got everything together you can finally deploy your own version for Teini:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzeekrey%2Fteini&env=STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,SHOP_NAME,SHOP_CONTACT,SHOP_HEADLINE,SHOP_SUBHEADLINE&envDescription=You'll%20need%20Stripe%20API%20key.&envLink=https%3A%2F%2Fstripe.com%2Fdocs%2Fkeys&project-name=teini-copy&repo-name=teini-copy&redirect-url=https%3A%2F%2Fkrey.io&demo-title=Teini%20-%20The%20smallest%20eShop%20in%20the%20world&demo-description=A%20real%20online%20store.%20But%20without%20the%20costs%20and%20without%20complexity.&demo-url=https%3A%2F%2Fteini.co&demo-image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1494256997604-768d1f608cac%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1829%26q%3D80)

## Usage

Once your store is up and running you definitly what to add your own products. Here is how to do this:

### 1. Access the repository

To make changes you need to access the repository and change the actual source code. To do this you'll need the following tools (all of them are for free):

- Git -> https://git-scm.com/
- VSCode -> https://code.visualstudio.com/
- Prisma Studio -> https://www.prisma.io/studio

Once you got everything installed open a terminal and type the following command:

```bash
git clone https://github.com/username/reponame
```

> 💡 The repo url depends on your choosen service, username and repo name.

### 2. Make changes to the product database

Open Prisma Studio and open the product.db file. It is located at the root level of your repo and called `products.db`. Once the database add, update or delete products.

### 3. Add product images

Teini holds all its static files like product images in the `public` folder. Product images in particular are store under `public/prodcuts/[productid]`. To add product images you just need to add a folder with the corresponding product-id (see your products.db) and put all product images in there.

> 💡 Google recommends using the WebP as image format. You can convert your files here: https://cloudconvert.com/webp-converter

### 3. Make changes to the store itself

Open a terminal and navigate (cd) to your local repository copy. Run this command:

```bash
code .
```

Now VSCode should open and you can change what ever you want.

### 4.Push your changes

To make your changes visible you need to run the following commands:

```bash
git add .
git commit -m "A message describing your work like; Added images for product 1."
git push
```

If your go to https://vercel.com and open your project you should see that a deployment is started. If it is successfull you customers can see your changes. If it failed feel free to create an issue: https://github.com/zeekrey/teini/issues/new/choose

### ...if you're a developer

Clone, Edit, Push. Do what ever you want.


## Notes

Credits for the used photos:

Product photos
Photo by <a href="https://unsplash.com/@boxedwater?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Boxed Water Is Better</a> on <a href="https://unsplash.com/@boxedwater?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

Success Page photo
Photo by <a href="https://unsplash.com/@jdent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jason Dent</a> on <a href="https://unsplash.com/s/photos/celebrate?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
