import { Page, Locator, expect } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  
  // Header y Navigation Locators
  readonly logoImg: Locator;
  readonly homeLink: Locator;
  readonly roomsLink: Locator;
  readonly contactLink: Locator;
  
  // Contact Section Locators
  readonly contactSection: Locator;
  readonly contactNameInput: Locator;
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactSubjectInput: Locator;
  readonly contactMessageTextarea: Locator;
  readonly contactSubmitBtn: Locator;
  readonly contactSuccessMessage: Locator;
  readonly contactErrorMessage: Locator;
  
  // Booking Section Locators
  readonly bookingSection: Locator;
  readonly checkAvailabilityBtn: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly checkinInput: Locator;
  readonly checkoutInput: Locator;
  readonly bookBtn: Locator;
  readonly bookingSuccessModal: Locator;
  readonly bookingErrorMessage: Locator;
  readonly closeBookingModal: Locator;
  
  // Room Selection Locators
  readonly roomImages: Locator;
  readonly roomDescriptions: Locator;
  readonly roomFeatures: Locator;
  readonly roomBookBtns: Locator;
  
  // Calendar Locators
  readonly calendarModal: Locator;
  readonly calendarNextBtn: Locator;
  readonly calendarPrevBtn: Locator;
  readonly calendarDays: Locator;
  readonly unavailableDays: Locator;
  readonly availableDays: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header y Navigation
    this.logoImg = page.locator('.hotel-logoUrl img');
    this.homeLink = page.locator('nav a[href="#home"]');
    this.roomsLink = page.locator('nav a[href="#rooms"]');
    this.contactLink = page.locator('nav a[href="#contact"]');
    
    // Contact Section
    this.contactSection = page.locator('#contact');
    this.contactNameInput = page.locator('[data-testid="ContactName"]');
    this.contactEmailInput = page.locator('[data-testid="ContactEmail"]');
    this.contactPhoneInput = page.locator('[data-testid="ContactPhone"]');
    this.contactSubjectInput = page.locator('[data-testid="ContactSubject"]');
    this.contactMessageTextarea = page.locator('[data-testid="ContactDescription"]');
    this.contactSubmitBtn = page.locator('button:has-text("Submit")');
    this.contactSuccessMessage = page.locator('.alert-success');
    this.contactErrorMessage = page.locator('.alert-danger');
    
    // Booking Section - Sección inicial de disponibilidad
    this.bookingSection = page.locator('#booking');
    this.checkAvailabilityBtn = page.locator('button:has-text("Check Availability")');
    this.firstNameInput = page.locator('input[placeholder="Firstname"]');
    this.lastNameInput = page.locator('input[placeholder="Lastname"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.phoneInput = page.locator('input[placeholder="Phone"]');
    this.checkinInput = page.locator('[name="checkin"]');
    this.checkoutInput = page.locator('[name="checkout"]');
    this.bookBtn = page.locator('.btn-outline-primary:has-text("Book")');
    this.bookingSuccessModal = page.locator('.ReactModal__Content');
    this.bookingErrorMessage = page.locator('.alert-danger');
    this.closeBookingModal = page.locator('.ReactModal__Content button:has-text("Close")');
    
    // Room Selection
    this.roomImages = page.locator('.room-image img');
    this.roomDescriptions = page.locator('.room-description');
    this.roomFeatures = page.locator('.room-features');
    this.roomBookBtns = page.locator('.openBooking');
    
    // Calendar
    this.calendarModal = page.locator('.rbc-calendar');
    this.calendarNextBtn = page.locator('.rbc-btn-group button:last-child');
    this.calendarPrevBtn = page.locator('.rbc-btn-group button:first-child');
    this.calendarDays = page.locator('.rbc-date-cell');
    this.unavailableDays = page.locator('.rbc-day-bg.rbc-off-range-bg');
    this.availableDays = page.locator('.rbc-date-cell:not(.rbc-off-range)');
  }

  // Navigation Methods
  async navigateToHome(): Promise<void> {
    await this.page.goto('/#home');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToRooms(): Promise<void> {
    await this.roomsLink.click();
    await this.page.waitForSelector('.room', { timeout: 10000 });
  }

  async navigateToContact(): Promise<void> {
    await this.contactLink.click();
    await this.contactSection.waitFor({ state: 'visible' });
  }

  // Contact Form Methods
  async fillContactName(name: string): Promise<void> {
    await this.contactNameInput.fill(name);
  }

  async fillContactEmail(email: string): Promise<void> {
    await this.contactEmailInput.fill(email);
  }

  async fillContactPhone(phone: string): Promise<void> {
    await this.contactPhoneInput.fill(phone);
  }

  async fillContactSubject(subject: string): Promise<void> {
    await this.contactSubjectInput.fill(subject);
  }

  async fillContactMessage(message: string): Promise<void> {
    await this.contactMessageTextarea.fill(message);
  }

  async submitContactForm(): Promise<void> {
    await this.contactSubmitBtn.click();
  }

  async fillCompleteContactForm(contactData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await this.fillContactName(contactData.name);
    await this.fillContactEmail(contactData.email);
    await this.fillContactPhone(contactData.phone);
    await this.fillContactSubject(contactData.subject);
    await this.fillContactMessage(contactData.message);
  }

  // Booking Methods
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async selectCheckinDate(date: string): Promise<void> {
    await this.checkinInput.fill(date);
  }

  async selectCheckoutDate(date: string): Promise<void> {
    await this.checkoutInput.fill(date);
  }

  async submitBooking(): Promise<void> {
    await this.bookBtn.click();
  }

  async closeBookingSuccessModal(): Promise<void> {
    await this.closeBookingModal.click();
  }

  async selectFirstAvailableRoom(): Promise<void> {
    const firstRoomBookBtn = this.roomBookBtns.first();
    await firstRoomBookBtn.click();
    await this.bookingSection.waitFor({ state: 'visible' });
  }

  // Availability Methods
  async checkDateAvailability(checkin: string, checkout: string): Promise<boolean> {
    await this.selectCheckinDate(checkin);
    await this.selectCheckoutDate(checkout);
    
    // Verificar si hay habitaciones disponibles
    const availableRooms = await this.roomBookBtns.count();
    return availableRooms > 0;
  }

  async getUnavailableDatesCount(): Promise<number> {
    if (await this.calendarModal.isVisible()) {
      return await this.unavailableDays.count();
    }
    return 0;
  }

  async getAvailableDatesCount(): Promise<number> {
    if (await this.calendarModal.isVisible()) {
      return await this.availableDays.count();
    }
    return 0;
  }

  // Validation Methods
  async waitForContactSuccess(): Promise<void> {
    await this.contactSuccessMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForContactError(): Promise<void> {
    await this.contactErrorMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForBookingSuccess(): Promise<void> {
    await this.bookingSuccessModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForBookingError(): Promise<void> {
    await this.bookingErrorMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async isContactFormVisible(): Promise<boolean> {
    return await this.contactSection.isVisible();
  }

  async isBookingFormVisible(): Promise<boolean> {
    return await this.bookingSection.isVisible();
  }

  async getRoomCount(): Promise<number> {
    return await this.roomImages.count();
  }

  // Screenshot Methods
  async takeContactFormScreenshot(name: string): Promise<void> {
    await this.contactSection.screenshot({ path: `screenshots/contact-${name}-${Date.now()}.png` });
  }

  async takeBookingFormScreenshot(name: string): Promise<void> {
    await this.bookingSection.screenshot({ path: `screenshots/booking-${name}-${Date.now()}.png` });
  }

  async takeFullPageScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/full-page-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}