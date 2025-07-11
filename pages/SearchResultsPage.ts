import { Page, expect, Locator } from '@playwright/test';

export default class SearchResultsPage {
  private readonly page: Page;
  private readonly bookLinks: Locator;     // ← ahora apuntamos a <a>

  constructor(page: Page) {
    this.page      = page;
    this.bookLinks = page.getByRole('link', { name: /book now/i });
  }

  
  async expectRooms(min = 1): Promise<void> {
    await this.page.waitForSelector('a:has-text("Book now")', { timeout: 10000 });
    const total = await this.bookLinks.count();
    await expect(total).toBeGreaterThanOrEqual(min);
  }
  async bookRoomAt(index = 0): Promise<void> {
    await this.bookLinks.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }
}
