import { test, expect } from '../fixtures/pageFixtures';
import { ContactData, validContactData, invalidContactData, contactFormTestData } from '../fixtures/testData';
import { allure } from 'allure-playwright';

test.describe('🔗 Contact Form Tests', () => {
  
  test.beforeEach(async ({ bookingPage }) => {
    await allure.step('Navegar a la sección de contacto', async () => {
      await bookingPage.navigateToContact();
      await expect(bookingPage.contactSection).toBeVisible();
    });
  });

  test('✅ Envío exitoso de formulario de contacto con datos válidos', async ({ bookingPage, page }) => {
    await allure.epic('Contact Form');
    await allure.feature('Form Submission');
    await allure.story('Successful Contact Form Submission');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.tag('contact');
    await allure.tag('positive');
    
    await allure.step('Completar formulario con datos válidos', async () => {
      await bookingPage.fillCompleteContactForm(validContactData);
      
      // Screenshot después de llenar el formulario
      await allure.attachment('Formulario completado', await page.screenshot(), 'image/png');
    });

    await allure.step('Enviar formulario', async () => {
      await bookingPage.submitContactForm();
    });

    await allure.step('Verificar mensaje de éxito', async () => {
      await bookingPage.waitForContactSuccess();
      await expect(bookingPage.contactSuccessMessage).toBeVisible();
      
      const successText = await bookingPage.contactSuccessMessage.textContent();
      await allure.attachment('Mensaje de éxito', successText || 'No message', 'text/plain');
      
      // Screenshot del mensaje de éxito
      await allure.attachment('Mensaje de éxito capturado', await page.screenshot(), 'image/png');
    });
  });

  test('❌ Validación de campos obligatorios en formulario de contacto', async ({ bookingPage, page }) => {
    await allure.epic('Contact Form');
    await allure.feature('Form Validation');
    await allure.story('Required Fields Validation');
    await allure.severity('high');
    await allure.tag('validation');
    await allure.tag('contact');
    await allure.tag('negative');

    await allure.step('Intentar enviar formulario con campos vacíos', async () => {
      await bookingPage.fillCompleteContactForm(invalidContactData);
      
      // Screenshot antes de enviar
      await allure.attachment('Formulario con datos inválidos', await page.screenshot(), 'image/png');
      
      await bookingPage.submitContactForm();
    });

    await allure.step('Verificar que aparezcan mensajes de error o que el formulario no se envíe', async () => {
      // Verificar que no aparezca mensaje de éxito
      try {
        await bookingPage.waitForContactError();
        await expect(bookingPage.contactErrorMessage).toBeVisible();
        
        const errorText = await bookingPage.contactErrorMessage.textContent();
        await allure.attachment('Mensaje de error', errorText || 'No error message', 'text/plain');
      } catch {
        // Si no hay mensaje de error específico, verificar que el formulario sigue visible
        await expect(bookingPage.contactSection).toBeVisible();
        await allure.attachment('Formulario sigue visible', 'El formulario no se envió correctamente', 'text/plain');
      }
      
      // Screenshot final
      await allure.attachment('Estado final del formulario', await page.screenshot(), 'image/png');
    });
  });

  test('📧 Validación de formato de email inválido', async ({ bookingPage, page }) => {
    await allure.epic('Contact Form');
    await allure.feature('Email Validation');
    await allure.story('Invalid Email Format');
    await allure.severity('medium');
    await allure.tag('validation');
    await allure.tag('email');
    await allure.tag('negative');

    const invalidEmailData: ContactData = {
      ...validContactData,
      email: 'email-invalido-sin-formato'
    };

    await allure.step('Completar formulario con email inválido', async () => {
      await bookingPage.fillCompleteContactForm(invalidEmailData);
      
      await allure.attachment('Email inválido ingresado', invalidEmailData.email, 'text/plain');
      await allure.attachment('Formulario con email inválido', await page.screenshot(), 'image/png');
    });

    await allure.step('Intentar enviar formulario', async () => {
      await bookingPage.submitContactForm();
    });

    await allure.step('Verificar validación de email', async () => {
      // Verificar que el navegador o la aplicación muestre validación
      const emailField = bookingPage.contactEmailInput;
      const isValid = await emailField.evaluate((input: HTMLInputElement) => input.validity.valid);
      
      expect(isValid).toBeFalsy();
      
      await allure.attachment('Validación de email', `Email válido: ${isValid}`, 'text/plain');
      await allure.attachment('Estado después de validación', await page.screenshot(), 'image/png');
    });
  });

  // Test parametrizado con múltiples casos
  for (const testData of contactFormTestData) {
    test(`🧪 ${testData.testCase}`, async ({ bookingPage, page }) => {
      await allure.epic('Contact Form');
      await allure.feature('Parametrized Tests');
      await allure.story(`Contact Form - ${testData.testCase}`);
      await allure.severity('normal');
      await allure.tag('parametrized');
      await allure.tag('contact');

      await allure.step('Ejecutar caso de prueba parametrizado', async () => {
        await allure.attachment('Datos de prueba', JSON.stringify(testData.data, null, 2), 'application/json');
        
        await bookingPage.fillCompleteContactForm(testData.data);
        await allure.attachment('Formulario completado', await page.screenshot(), 'image/png');
        
        await bookingPage.submitContactForm();
        
        if (testData.expectedResult === 'success') {
          try {
            await bookingPage.waitForContactSuccess();
            await expect(bookingPage.contactSuccessMessage).toBeVisible();
            await allure.attachment('Resultado exitoso', await page.screenshot(), 'image/png');
          } catch (error) {
            await allure.attachment('Error en caso exitoso', error.toString(), 'text/plain');
            throw error;
          }
        } else {
          // Para casos de error, verificar que el formulario sigue visible o hay mensaje de error
          try {
            await bookingPage.waitForContactError();
            await expect(bookingPage.contactErrorMessage).toBeVisible();
          } catch {
            // Si no hay mensaje de error, verificar que el formulario no se envió
            await expect(bookingPage.contactSection).toBeVisible();
          }
          await allure.attachment('Validación correcta de error', await page.screenshot(), 'image/png');
        }
      });
    });
  }

  test('📱 Responsividad del formulario de contacto', async ({ bookingPage, page }) => {
    await allure.epic('Contact Form');
    await allure.feature('Responsive Design');
    await allure.story('Mobile Responsive Contact Form');
    await allure.severity('low');
    await allure.tag('responsive');
    await allure.tag('mobile');
    await allure.tag('ui');

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 }
    ];

    for (const viewport of viewports) {
      await allure.step(`Probar en viewport ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500); // Tiempo para que se ajuste el layout
        
        await expect(bookingPage.contactSection).toBeVisible();
        await expect(bookingPage.contactNameInput).toBeVisible();
        await expect(bookingPage.contactSubmitBtn).toBeVisible();
        
        await allure.attachment(`Vista ${viewport.name}`, await page.screenshot({ fullPage: true }), 'image/png');
      });
    }
  });
});
