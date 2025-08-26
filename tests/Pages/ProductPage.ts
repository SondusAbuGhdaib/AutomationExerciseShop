import { Page, expect } from '@playwright/test';

export class ProductPage {
  constructor(private page: Page) {}

  async addToCart() {
    await this.page.getByRole('link', { name: 'View Cart' }).click();

   
  }
  async placeOrder() {
    await this.page.click('a[href="/checkout"]');
    await expect(this.page).toHaveURL(/checkout/);
    // Add mock payment steps if needed
    await this.page.fill('input[name="name_on_card"]', 'Test User');
    await this.page.fill('input[name="card_number"]', '4111111111111111');
    await this.page.fill('input[name="cvc"]', '123');
    await this.page.fill('input[name="expiry_month"]', '12');
    await this.page.fill('input[name="expiry_year"]', '2030');
    await this.page.click('#submit');
    await expect(this.page.locator('.success-message')).toContainText('Your order has been placed!');
  }
}
