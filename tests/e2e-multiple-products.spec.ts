import { test } from '@playwright/test';
import { HomePage } from './Pages/HomePage';
import { BrandPage } from './Pages/BrandPage';
import { CartPage } from './Pages/CartPage';
import { ProductPage } from './Pages/ProductPage';


test('Add products from multiple brands and verify cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const brandPage = new BrandPage(page);
  const cartPage = new CartPage(page);
  const product = new ProductPage(page);

  // Step 1: Go to homepage
  await homePage.gotoHome();

  // Step 2: Add product from Madame brand
  await brandPage.gotoBrand('Madame');
  await brandPage.addProductToCart(0);

  // Step 3: Back to Home
  await homePage.gotoHome();

  // Step 4: Add product from H&M brand
  await brandPage.gotoBrand('H&M');
  await brandPage.addProductToCart(1);

  // Step 5: Go to Cart
  await product.addToCart();


  });
