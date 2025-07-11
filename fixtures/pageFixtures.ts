import { test as base, BrowserContext, Page } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

type TestFixtures = {
  bookingPage: BookingPage;
  context: BrowserContext;
  page: Page;
};

export const test = base.extend<TestFixtures>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: 'test-results/videos/',
        size: { width: 1280, height: 720 }
      },
      recordHar: {
        path: 'test-results/har/test.har',
        mode: 'minimal'
      }
    });
    
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    
    // Configurar listeners para capturar errores de consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });

    // Configurar listener para requests fallidos
    page.on('requestfailed', request => {
      console.log(`Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    await use(page);
  },

  bookingPage: async ({ page }, use) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.navigateToHome();
    await use(bookingPage);
  }
});

export { expect } from '@playwright/test';
