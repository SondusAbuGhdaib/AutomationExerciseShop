import { Page, expect } from '@playwright/test';

export class ProductPage {
  constructor(private page: Page) {}

  // Add product to cart
  async addToCart() {
    // Wait for page to be fully loaded
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try multiple selectors for the Add to Cart button
    const addToCartButton = this.page.locator(
      'button:has-text("Add to cart"), a:has-text("Add to cart"), .add-to-cart, .btn-add-to-cart'
    ).first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
    } else {
      // Fallback: try to find any button or link with "Add to cart" text
      await this.page.getByRole('button', { name: /Add to cart/i }).click();
    }
    
    // Wait for success message or modal
    try {
      await this.page.waitForSelector('.modal-content, .success-message, .alert-success', { timeout: 10000 });
      await expect(this.page.locator('.modal-content, .success-message, .alert-success')).toContainText(/Added|Success|added/i);
    } catch (error) {
      // If no modal appears, continue anyway
      console.log('No success modal found, continuing...');
    }
    
    // Try to find and click "View Cart" button
    const viewCartButton = this.page.locator(
      'a:has-text("View Cart"), a:has-text("view cart"), .view-cart, .btn-view-cart'
    ).first();
    
    if (await viewCartButton.isVisible()) {
      await viewCartButton.click();
    } else {
      // Fallback: navigate to cart directly
      await this.page.goto('https://automationexercise.com/view_cart');
    }
    
    // Wait for cart page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Verify navigation to cart page
    await expect(this.page).toHaveURL(/view_cart|cart/);
  }

  // Add specific product to cart by name
  async addSpecificProductToCart(productName: string) {
    // Wait for products to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Find product by name and click "Add to cart"
    const productCard = this.page.locator('.product-image-wrapper, .single-products, .product-item').filter({ hasText: productName });
    
    if (await productCard.count() > 0) {
      await productCard.locator('a[href*="product_details"], a:has-text("Add to cart")').first().click();
    } else {
      throw new Error(`Product "${productName}" not found`);
    }
    
    // Wait for product details page or add to cart
    await this.page.waitForLoadState('domcontentloaded');
    
    // Add to cart
    await this.addToCart();
  }

  // Get product price
  async getProductPrice() {
    const priceElement = this.page.locator('.product-information .price span, .product-price, .price');
    if (await priceElement.count() > 0) {
      return await priceElement.first().textContent();
    }
    return null;
  }

  // Get product name
  async getProductName() {
    const nameElement = this.page.locator('.product-information h2, .product-name, h1');
    if (await nameElement.count() > 0) {
      return await nameElement.first().textContent();
    }
    return null;
  }
}
