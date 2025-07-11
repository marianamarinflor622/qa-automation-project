import { Page, expect, Locator } from '@playwright/test';

export default class HomePage {
  private readonly page: Page;
  private readonly checkinInput:  Locator;
  private readonly checkoutInput: Locator;
  private readonly searchButton:  Locator;

  constructor(page: Page) {
    this.page = page;
    // Selecciona el <input> que sigue inmediatamente al texto “Check In”
    this.checkinInput  = page.locator('text=Check In').locator('xpath=following::input[1]');
    // Selecciona el <input> que sigue inmediatamente al texto “Check Out”
    this.checkoutInput = page.locator('text=Check Out').locator('xpath=following::input[1]');
    this.searchButton  = page.locator('button:has-text("Check Availability")');
  }

  /** Abre la home */
  async navigate(): Promise<void> {
    await this.page.goto('https://automationintesting.online/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Rellena fechas y pulsa “Check Availability” */
  async search(checkin: string, checkout: string): Promise<void> {
    await this.checkinInput.fill(checkin);
    await this.checkoutInput.fill(checkout);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
