import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async gotoHome() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/automationexercise\.com/);
  }

  async navigateToProducts() {
    await this.page.getByRole('link', { name: ' Products' }).click();
    await expect(this.page).toHaveURL(/products/);
  }

  async viewFirstProduct() {
    await this.page.locator('.product-image-wrapper a').first().click();
    await expect(this.page).toHaveURL("https://automationexercise.com/products"); // ✅ Correct URL pattern
  }

  async gotoCart() {
    await this.page.getByRole('link', { name: 'Cart' }).click();
  }
}
