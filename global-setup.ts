import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './tests/Pages/LoginPage';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Ensure env vars are available when global setup runs in its own process
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  const configuredBaseURL = (config.projects[0] && (config.projects[0] as any).use?.baseURL) as string | undefined;
  const baseURL = configuredBaseURL || process.env.BASE_URL;
  if (!baseURL) throw new Error('BASE_URL is not defined in config or .env');
  await page.goto(baseURL);
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  // Save logged-in state
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
