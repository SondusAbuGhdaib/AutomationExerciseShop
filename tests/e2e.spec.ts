import { test } from '@playwright/test';
import { HomePage } from './Pages/HomePage';
import { ProductPage } from './Pages/ProductPage';
import { CartPage } from './Pages/CartPage';
import { LoginPage } from './Pages/LoginPage';


test('E2E: Browse, add to cart & checkout flow', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://automationexercise.com');
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.navigateToProducts();
  await home.viewFirstProduct();
  await product.addToCart();
  await cart.proceedToCheckout();
  await cart.fillPaymentDetails();
  await cart.confirmOrder();
  await cart.verifyOrderPlaced();
  await cart.continueAfterOrder();



});
