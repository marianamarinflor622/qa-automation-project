import { test, expect } from '@playwright/test';

test('🔍 Inspeccionar elementos específicos', async ({ page }) => {
  await page.goto('https://automationintesting.online');
  await page.waitForLoadState('networkidle');
  
  console.log('=== INSPECCIONANDO ELEMENTOS ESPECÍFICOS ===');
  
  // Verificar textarea para mensaje
  const textareas = page.locator('textarea');
  const textareaCount = await textareas.count();
  console.log(`Textareas encontrados: ${textareaCount}`);
  
  for (let i = 0; i < textareaCount; i++) {
    const textarea = textareas.nth(i);
    const placeholder = await textarea.getAttribute('placeholder') || 'sin placeholder';
    const name = await textarea.getAttribute('name') || 'sin name';
    const id = await textarea.getAttribute('id') || 'sin id';
    const testId = await textarea.getAttribute('data-testid') || 'sin data-testid';
    
    console.log(`Textarea ${i}: placeholder="${placeholder}", name="${name}", id="${id}", data-testid="${testId}"`);
  }
  
  // Verificar botón de envío
  const submitBtn = page.locator('#submitContact');
  const submitExists = await submitBtn.count();
  console.log(`Botón #submitContact existe: ${submitExists}`);
  
  if (submitExists > 0) {
    const btnText = await submitBtn.textContent();
    console.log(`Texto del botón: "${btnText}"`);
  }
  
  // Verificar estructura de booking
  const bookingForm = page.locator('.booking-form');
  const bookingExists = await bookingForm.count();
  console.log(`Formulario .booking-form existe: ${bookingExists}`);
  
  // Verificar inputs de booking
  const firstNameInput = page.locator('input[placeholder="Firstname"]');
  const lastNameInput = page.locator('input[placeholder="Lastname"]');
  
  console.log(`Input Firstname existe: ${await firstNameInput.count()}`);
  console.log(`Input Lastname existe: ${await lastNameInput.count()}`);
  
  // Verificar botones de room booking
  const roomBookBtns = page.locator('.openBooking');
  console.log(`Botones .openBooking encontrados: ${await roomBookBtns.count()}`);
  
  // Verificar calendario
  const calendar = page.locator('.rbc-calendar');
  console.log(`Calendario .rbc-calendar existe: ${await calendar.count()}`);
  
  // Tomar screenshot final
  await page.screenshot({ 
    path: 'test-results/detailed-inspection.png',
    fullPage: true 
  });
});
