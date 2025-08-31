import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  // Navigate to cart page
  async gotoCart() {
    await this.page.getByRole('link', { name: 'Cart' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveURL(/view_cart|cart/);
  }

  // Verify product is listed with correct price & quantity
  async verifyProductDetails(productName: string, expectedPrice: string, expectedQuantity: number = 1) {
    // Wait for cart to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Verify product name is displayed
    const productNameElement = this.page.locator('.cart_description h4 a, .cart-item-name, .product-name');
    await expect(productNameElement.first()).toContainText(productName);
    
    // Verify product price
    const priceElement = this.page.locator('.cart_price p, .cart-price, .price');
    await expect(priceElement.first()).toContainText(expectedPrice);
    
    // Verify quantity
    const quantityInput = this.page.locator('.cart_quantity input[type="number"], .quantity-input, input[type="number"]');
    await expect(quantityInput.first()).toHaveValue(expectedQuantity.toString());
  }

  // Increase quantity and verify total price calculation
  async increaseQuantityAndVerifyPrice(productIndex: number = 0, newQuantity: number) {
    const quantityInput = this.page.locator('.cart_quantity input[type="number"], .quantity-input, input[type="number"]').nth(productIndex);
    const priceElement = this.page.locator('.cart_price p, .cart-price, .price').nth(productIndex);
    const totalElement = this.page.locator('.cart_total p, .cart-total, .total').nth(productIndex);
    
    // Get current price
    const currentPriceText = await priceElement.textContent();
    const currentPrice = parseFloat(currentPriceText?.replace(/[^\d.]/g, '') || '0');
    
    // Update quantity
    await quantityInput.fill(newQuantity.toString());
    await quantityInput.press('Enter');
    
    // Wait for page to update by waiting for the total to change
    await this.page.waitForFunction(() => {
      const totalElement = document.querySelector('.cart_total p, .cart-total, .total');
      return totalElement && totalElement.textContent && totalElement.textContent.includes(newQuantity.toString());
    });
    
    // Verify total price calculation
    const expectedTotal = currentPrice * newQuantity;
    const actualTotalText = await totalElement.textContent();
    const actualTotal = parseFloat(actualTotalText?.replace(/[^\d.]/g, '') || '0');
    
    expect(actualTotal).toBe(expectedTotal);
  }

  // Decrease quantity and verify total price calculation
  async decreaseQuantityAndVerifyPrice(productIndex: number = 0, newQuantity: number) {
    const quantityInput = this.page.locator('.cart_quantity input[type="number"], .quantity-input, input[type="number"]').nth(productIndex);
    const priceElement = this.page.locator('.cart_price p, .cart-price, .price').nth(productIndex);
    const totalElement = this.page.locator('.cart_total p, .cart-total, .total').nth(productIndex);
    
    // Get current price
    const currentPriceText = await priceElement.textContent();
    const currentPrice = parseFloat(currentPriceText?.replace(/[^\d.]/g, '') || '0');
    
    // Update quantity
    await quantityInput.fill(newQuantity.toString());
    await quantityInput.press('Enter');
    
    // Wait for page to update by waiting for the total to change
    await this.page.waitForFunction(() => {
      const totalElement = document.querySelector('.cart_total p, .cart-total, .total');
      return totalElement && totalElement.textContent && totalElement.textContent.includes(newQuantity.toString());
    });
    
    // Verify total price calculation
    const expectedTotal = currentPrice * newQuantity;
    const actualTotalText = await totalElement.textContent();
    const actualTotal = parseFloat(actualTotalText?.replace(/[^\d.]/g, '') || '0');
    
    expect(actualTotal).toBe(expectedTotal);
  }

  // Remove item from cart
  async removeItem(productIndex: number = 0) {
    const removeButton = this.page.locator('.cart_quantity_delete, .remove-item, .delete-item, .btn-remove').nth(productIndex);
    
    if (await removeButton.isVisible()) {
      await removeButton.click();
      
      // Wait for removal to complete by waiting for cart items to update
      await this.page.waitForFunction(() => {
        const cartItems = document.querySelectorAll('.cart_item, .cart-item, .item');
        return cartItems.length === 0;
      });
    } else {
      throw new Error('Remove button not found');
    }
  }

  // Verify cart is empty
  async verifyCartIsEmpty() {
    // Wait for cart to update
    await this.page.waitForLoadState('domcontentloaded');
    
    // Check for empty cart message
    const emptyCartMessage = this.page.locator('.cart_info, .empty-cart, .cart-empty');
    
    if (await emptyCartMessage.count() > 0) {
      await expect(emptyCartMessage.first()).toContainText(/Cart is empty|empty cart|no items/i);
    }
    
    // Verify no cart items are present
    const cartItems = this.page.locator('.cart_item, .cart-item, .item');
    await expect(cartItems).toHaveCount(0);
  }

  // Try to proceed to checkout with empty cart
  async tryCheckoutWithEmptyCart() {
    const checkoutButton = this.page.getByText('Proceed To Checkout');
    
    // Verify checkout button is disabled or shows appropriate message
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      // Should show error message or stay on cart page
      await expect(this.page).toHaveURL(/view_cart|cart/);
    }
  }

  // Get cart total
  async getCartTotal() {
    const totalElement = this.page.locator('.cart_total_price, .cart-total, .total-price, .grand-total');
    
    if (await totalElement.count() > 0) {
      const totalText = await totalElement.first().textContent();
      return parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
    }
    return 0;
  }

  // Get number of items in cart
  async getCartItemCount() {
    const cartItems = this.page.locator('.cart_item, .cart-item, .item');
    return await cartItems.count();
  }

  // Verify cart item count
  async verifyCartItemCount(expectedCount: number) {
    const actualCount = await this.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
  }

  // Proceed to checkout (when cart has items)
  async proceedToCheckout() {
    await this.page.getByText('Proceed To Checkout').click();
    await this.page.waitForLoadState('domcontentloaded');
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
