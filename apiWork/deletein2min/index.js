import Shopify from "shopify-api-node";
const shopify = new Shopify({
  shopName: "messoldtech-test.myshopify.com",
  // accessToken: "ba7828c032c0126de99e75f6e74cce11 ",
  // storefrontAccessToken: "c1ead05360c18ca6c3a1b1ea32c5ab48",
  apiKey: "fa14698cf08907476b4e16cf8f324646",
  password: "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",
});

shopify.product.list().then(function (products) {
  console.log(products);
});
