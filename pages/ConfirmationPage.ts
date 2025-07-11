import { Page, expect, Locator } from '@playwright/test';

export default class ConfirmationPage {
  private readonly page: Page;
  private readonly banner:        Locator;
  private readonly returnHomeBtn: Locator;

  constructor(page: Page) {
    this.page          = page;
    this.banner        = page.locator('text=Booking Confirmed');
    this.returnHomeBtn = page.locator('button:has-text("Return home")');
  }

  async expectConfirmed(): Promise<void> {
    await expect(this.banner).toBeVisible();
  }

  async returnHome(): Promise<void> {
    await this.returnHomeBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
