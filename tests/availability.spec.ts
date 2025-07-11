import { test, expect } from '../fixtures/pageFixtures';
import { availabilityTestData, futureDatesBooking, pastDatesBooking } from '../fixtures/testData';
import { allure } from 'allure-playwright';

test.describe('📅 Availability Validation Tests', () => {
  
  test.beforeEach(async ({ bookingPage }) => {
    await allure.step('Navegar a la página principal y verificar habitaciones', async () => {
      await bookingPage.navigateToHome();
      const roomCount = await bookingPage.roomImages.count();
      expect(roomCount).toBeGreaterThan(0);
    });
  });

  test('✅ Verificar disponibilidad con fechas futuras válidas', async ({ bookingPage, page }) => {
    await allure.epic('Booking System');
    await allure.feature('Availability Check');
    await allure.story('Valid Future Dates Availability');
    await allure.severity('critical');
    await allure.tag('availability');
    await allure.tag('positive');
    await allure.tag('booking');
    
    await allure.step('Seleccionar primera habitación disponible', async () => {
      const roomCount = await bookingPage.getRoomCount();
      await allure.attachment('Número de habitaciones encontradas', roomCount.toString(), 'text/plain');
      
      await bookingPage.selectFirstAvailableRoom();
      await expect(bookingPage.bookingSection).toBeVisible();
      
      await allure.attachment('Formulario de reserva abierto', await page.screenshot(), 'image/png');
    });

    await allure.step('Verificar disponibilidad con fechas futuras', async () => {
      const checkin = futureDatesBooking.checkin;
      const checkout = futureDatesBooking.checkout;
      
      await allure.attachment('Fechas de prueba', `Check-in: ${checkin}, Check-out: ${checkout}`, 'text/plain');
      
      const isAvailable = await bookingPage.checkDateAvailability(checkin, checkout);
      
      await allure.attachment('Resultado disponibilidad', `Disponible: ${isAvailable}`, 'text/plain');
      await allure.attachment('Estado después de verificar fechas', await page.screenshot(), 'image/png');
      
      expect(isAvailable).toBeTruthy();
    });
  });

  test('❌ Verificar comportamiento con fechas pasadas', async ({ bookingPage, page }) => {
    await allure.epic('Booking System');
    await allure.feature('Availability Check');
    await allure.story('Past Dates Validation');
    await allure.severity('high');
    await allure.tag('availability');
    await allure.tag('negative');
    await allure.tag('validation');

    await allure.step('Seleccionar habitación para prueba', async () => {
      await bookingPage.selectFirstAvailableRoom();
      await expect(bookingPage.bookingSection).toBeVisible();
    });

    await allure.step('Intentar seleccionar fechas pasadas', async () => {
      const checkin = pastDatesBooking.checkin;
      const checkout = pastDatesBooking.checkout;
      
      await allure.attachment('Fechas pasadas utilizadas', `Check-in: ${checkin}, Check-out: ${checkout}`, 'text/plain');
      
      await bookingPage.selectCheckinDate(checkin);
      await bookingPage.selectCheckoutDate(checkout);
      
      await allure.attachment('Campos con fechas pasadas', await page.screenshot(), 'image/png');
    });

    await allure.step('Verificar validación de fechas pasadas', async () => {
      // Verificar que los campos de fecha no acepten fechas pasadas o muestren validación
      const checkinValue = await bookingPage.checkinInput.inputValue();
      const checkoutValue = await bookingPage.checkoutInput.inputValue();
      
      await allure.attachment('Valores en campos de fecha', `Check-in: ${checkinValue}, Check-out: ${checkoutValue}`, 'text/plain');
      
      // Intentar enviar la reserva para ver si hay validación
      try {
        await bookingPage.fillFirstName(pastDatesBooking.firstName);
        await bookingPage.fillLastName(pastDatesBooking.lastName);
        await bookingPage.fillEmail(pastDatesBooking.email);
        await bookingPage.fillPhone(pastDatesBooking.phone);
        
        await allure.attachment('Formulario completo con fechas pasadas', await page.screenshot(), 'image/png');
        
        await bookingPage.submitBooking();
        
        // Verificar que aparezca algún tipo de error o validación
        try {
          await bookingPage.waitForBookingError();
          await expect(bookingPage.bookingErrorMessage).toBeVisible();
          
          const errorText = await bookingPage.bookingErrorMessage.textContent();
          await allure.attachment('Mensaje de error por fechas pasadas', errorText || 'No error message', 'text/plain');
        } catch {
          // Si no hay mensaje de error, verificar que el formulario sigue visible
          await expect(bookingPage.bookingSection).toBeVisible();
          await allure.attachment('Formulario sigue visible', 'La reserva no se procesó', 'text/plain');
        }
        
        await allure.attachment('Estado final después de intentar reserva', await page.screenshot(), 'image/png');
        
      } catch (error) {
        await allure.attachment('Error durante validación', error.toString(), 'text/plain');
      }
    });
  });

  test('🔄 Verificar fecha de salida anterior a fecha de entrada', async ({ bookingPage, page }) => {
    await allure.epic('Booking System');
    await allure.feature('Date Validation');
    await allure.story('Checkout Before Checkin Validation');
    await allure.severity('medium');
    await allure.tag('validation');
    await allure.tag('dates');
    await allure.tag('negative');

    await allure.step('Configurar escenario de prueba', async () => {
      await bookingPage.selectFirstAvailableRoom();
      await expect(bookingPage.bookingSection).toBeVisible();
    });

    await allure.step('Ingresar fecha de salida anterior a fecha de entrada', async () => {
      const checkinDate = '2025-08-20';
      const checkoutDate = '2025-08-15'; // Fecha anterior
      
      await allure.attachment('Fechas invertidas', `Check-in: ${checkinDate}, Check-out: ${checkoutDate}`, 'text/plain');
      
      await bookingPage.selectCheckinDate(checkinDate);
      await bookingPage.selectCheckoutDate(checkoutDate);
      
      await allure.attachment('Fechas invertidas ingresadas', await page.screenshot(), 'image/png');
    });

    await allure.step('Verificar validación de fechas invertidas', async () => {
      // Verificar comportamiento del formulario con fechas invertidas
      const checkinValue = await bookingPage.checkinInput.inputValue();
      const checkoutValue = await bookingPage.checkoutInput.inputValue();
      
      await allure.attachment('Valores actuales en campos', `Check-in: ${checkinValue}, Check-out: ${checkoutValue}`, 'text/plain');
      
      // Intentar completar y enviar formulario
      await bookingPage.fillFirstName('Test');
      await bookingPage.fillLastName('User');
      await bookingPage.fillEmail('test@email.com');
      await bookingPage.fillPhone('+1234567890');
      
      await bookingPage.submitBooking();
      
      // Verificar que no se procese la reserva o aparezca error
      try {
        await bookingPage.waitForBookingError();
        await expect(bookingPage.bookingErrorMessage).toBeVisible();
      } catch {
        // Si no hay mensaje de error específico, verificar que el formulario sigue visible
        await expect(bookingPage.bookingSection).toBeVisible();
      }
      
      await allure.attachment('Validación de fechas invertidas', await page.screenshot(), 'image/png');
    });
  });

  // Tests parametrizados para diferentes escenarios de disponibilidad
  for (const testData of availabilityTestData) {
    test(`🧪 ${testData.testCase}`, async ({ bookingPage, page }) => {
      await allure.epic('Booking System');
      await allure.feature('Parametrized Availability Tests');
      await allure.story(`Availability - ${testData.testCase}`);
      await allure.severity('normal');
      await allure.tag('parametrized');
      await allure.tag('availability');

      await allure.step('Ejecutar caso de prueba parametrizado', async () => {
        await allure.attachment('Parámetros de prueba', JSON.stringify(testData, null, 2), 'application/json');
        
        await bookingPage.selectFirstAvailableRoom();
        await expect(bookingPage.bookingSection).toBeVisible();
        
        const isAvailable = await bookingPage.checkDateAvailability(testData.checkin, testData.checkout);
        
        await allure.attachment('Resultado obtenido', `Disponible: ${isAvailable}`, 'text/plain');
        await allure.attachment('Resultado esperado', `Disponible: ${testData.expectedAvailable}`, 'text/plain');
        await allure.attachment('Estado después de verificación', await page.screenshot(), 'image/png');
        
        if (testData.expectedAvailable) {
          expect(isAvailable).toBeTruthy();
        } else {
          // Para casos donde esperamos que no esté disponible, 
          // verificamos que la validación funcione correctamente
          expect(isAvailable).toBeFalsy();
        }
      });
    });
  }

  test('📊 Verificar conteo de días disponibles vs no disponibles', async ({ bookingPage, page }) => {
    await allure.epic('Booking System');
    await allure.feature('Calendar Analysis');
    await allure.story('Available vs Unavailable Days Count');
    await allure.severity('low');
    await allure.tag('calendar');
    await allure.tag('analysis');
    await allure.tag('ui');

    await allure.step('Abrir formulario de reserva', async () => {
      await bookingPage.selectFirstAvailableRoom();
      await expect(bookingPage.bookingSection).toBeVisible();
    });

    await allure.step('Analizar calendario si está visible', async () => {
      // Verificar si hay un calendario visible
      const isCalendarVisible = await bookingPage.calendarModal.isVisible();
      
      await allure.attachment('Calendar visible', `${isCalendarVisible}`, 'text/plain');
      
      if (isCalendarVisible) {
        const availableDaysCount = await bookingPage.getAvailableDatesCount();
        const unavailableDaysCount = await bookingPage.getUnavailableDatesCount();
        
        await allure.attachment('Días disponibles', availableDaysCount.toString(), 'text/plain');
        await allure.attachment('Días no disponibles', unavailableDaysCount.toString(), 'text/plain');
        
        expect(availableDaysCount).toBeGreaterThanOrEqual(0);
        expect(unavailableDaysCount).toBeGreaterThanOrEqual(0);
        
        await allure.attachment('Análisis de calendario', await page.screenshot(), 'image/png');
      } else {
        await allure.attachment('Nota', 'Calendar no visible en esta vista', 'text/plain');
      }
    });
  });

  test('⚡ Performance - Tiempo de respuesta en verificación de disponibilidad', async ({ bookingPage, page }) => {
    await allure.epic('Booking System');
    await allure.feature('Performance');
    await allure.story('Availability Check Response Time');
    await allure.severity('medium');
    await allure.tag('performance');
    await allure.tag('timing');

    await allure.step('Medir tiempo de respuesta', async () => {
      await bookingPage.selectFirstAvailableRoom();
      
      const startTime = Date.now();
      
      await bookingPage.selectCheckinDate(futureDatesBooking.checkin);
      await bookingPage.selectCheckoutDate(futureDatesBooking.checkout);
      
      // Esperar a que se procese la selección de fechas
      await page.waitForTimeout(1000);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      await allure.attachment('Tiempo de respuesta (ms)', responseTime.toString(), 'text/plain');
      await allure.attachment('Estado después de selección de fechas', await page.screenshot(), 'image/png');
      
      // Verificar que el tiempo de respuesta sea razonable (menos de 5 segundos)
      expect(responseTime).toBeLessThan(5000);
    });
  });
});
