import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async gotoHome() {
    await this.page.goto('https://automationexercise.com');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/automationexercise\.com/);
  }

  async navigateToProducts() {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try different selectors for the Products link
    const productsLink = this.page.locator('a[href="/products"], a:has-text("Products"), .navbar-nav a:has-text("Products")').first();
    
    if (await productsLink.isVisible()) {
      await productsLink.click();
    } else {
      // Fallback: try to find any link containing "Products"
      await this.page.getByRole('link', { name: /Products/i }).click();
    }
    
    // Wait for navigation and verify URL
    await this.page.waitForURL(/products/);
    await expect(this.page).toHaveURL(/products/);
  }

  async viewFirstProduct() {
    // Wait for products to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Find and click the first product
    const firstProduct = this.page.locator('.product-image-wrapper a, .single-products a, .product-image a').first();
    await firstProduct.click();
    
    // Wait for product details page to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoCart() {
    // Wait for page to be ready
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try different selectors for Cart link
    const cartLink = this.page.locator('a[href="/view_cart"], a:has-text("Cart"), .navbar-nav a:has-text("Cart")').first();
    
    if (await cartLink.isVisible()) {
      await cartLink.click();
    } else {
      // Fallback: try to find any link containing "Cart"
      await this.page.getByRole('link', { name: /Cart/i }).click();
    }
    
    // Wait for cart page to load
    await this.page.waitForLoadState('domcontentloaded');
  }
}
