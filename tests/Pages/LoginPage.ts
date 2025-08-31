import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.click('a[href="/login"]');
    await this.page.fill('input[data-qa="login-email"]', email);
    await this.page.fill('input[data-qa="login-password"]', password);
    await this.page.click('button[data-qa="login-button"]');
    await this.page.waitForURL('**/'); // wait until homepage
  }
}
