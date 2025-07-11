import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';

import HomePage          from '../../pages/HomePage';
import SearchResultsPage from '../../pages/SearchResultsPage';
import BookingFormPage   from '../../pages/BookingFormPage';
import ConfirmationPage  from '../../pages/ConfirmationPage';

test.describe('Reservation end-to-end flow', () => {
  test('user can search availability and book a room', async ({ page }) => {
   
    const home    = new HomePage(page);
    const results = new SearchResultsPage(page);
    const form    = new BookingFormPage(page);
    const confirm = new ConfirmationPage(page);


    await home.navigate();
    await expect(page).toHaveURL('https://automationintesting.online/');

   
    const today    = DateTime.local().startOf('day');
    const checkin  = today.plus({ days: 1 }).toISODate();
    const checkout = today.plus({ days: 2 }).toISODate();

   
    await home.search(checkin, checkout);

   
    await results.expectRooms();
    await results.bookRoomAt(0);

   
    await form.fillGuestDetails(
      'Mariana',
      'Marin',
      'mariana@prueba.com',
      '12345678920'
    );
    await form.submit();

   
    await confirm.expectConfirmed();
    await confirm.returnHome();
    await expect(page).toHaveURL('https://automationintesting.online/');
  });
});
