import { Page, expect, Locator } from '@playwright/test';

export default class BookingFormPage {
  private readonly page: Page;
  private readonly firstName: Locator;
  private readonly lastName:  Locator;
  private readonly email:     Locator;
  private readonly phone:     Locator;
  private readonly reserveBtn: Locator;

  constructor(page: Page) {
    this.page      = page;
    this.firstName = page.getByPlaceholder(/first name/i);
    this.lastName  = page.getByPlaceholder(/last name/i);
    this.email     = page.getByPlaceholder(/email/i);
    this.phone     = page.getByPlaceholder(/phone/i);
    this.reserveBtn = page.getByRole('button', { name: /reserve now/i });
  }

  async fillGuestDetails(
    fn: string,
    ln: string,
    mail: string,
    tel: string
  ): Promise<void> {
    await this.firstName.fill(fn);
    await this.lastName.fill(ln);
    await this.email.fill(mail);
    await this.phone.fill(tel);
  }

  async submit(): Promise<void> {
    await expect(this.reserveBtn).toBeEnabled();
    await this.reserveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
