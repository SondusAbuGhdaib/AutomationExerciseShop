import { Page, expect } from '@playwright/test';

export class BrandPage {
  constructor(private page: Page) {}

  async gotoBrand(brandName: string) {
    await this.page.goto(`/brand_products/${brandName}`);
    await expect(this.page).toHaveURL(new RegExp(`brand_products/${brandName}`));
  }

  async addProductToCart(productIndex: number = 0) {
    const productCard = this.page.locator('.product-image-wrapper').nth(productIndex);
    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();

    const addButton = productCard.locator('.overlay-content .add-to-cart').first();
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    // Close modal if it appears
    /*const modalClose = this.page.locator('.btn-success.close-modal');
    if (await modalClose.isVisible()) {
      await modalClose.click();
    }*/
  }
}
