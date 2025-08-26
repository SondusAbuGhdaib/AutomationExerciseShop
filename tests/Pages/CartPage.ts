import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async proceedToCheckout() {
    await this.page.getByText('Proceed To Checkout').click();
    await expect(this.page).toHaveURL(/checkout/);
  }

  async fillPaymentDetails() {
    await this.page.getByRole('link', { name: 'Place Order' }).click();
    await this.page.locator('input[name="name_on_card"]').fill('Test User');
    await this.page.locator('input[name="card_number"]').fill('4111111111111111');
     await this.page.getByRole('textbox', { name: 'ex.' }).fill('123');
      await this.page.getByRole('textbox', { name: 'MM' }).fill('12');
       await this.page.getByRole('textbox', { name: 'YYYY' }).fill('30');
  }

  async confirmOrder() {
    await this.page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
}

  async verifyOrderPlaced() {
    await this.page.getByText('Order Placed!').click();
      await expect(this.page.locator('#form')).toContainText('Congratulations! Your order has been confirmed!');
       await expect(this.page.locator('#form')).toContainText('Order Placed!');
  }

  async continueAfterOrder() {
    await this.page.getByRole('link', { name: 'Continue' }).click();

  }
 
 
}
