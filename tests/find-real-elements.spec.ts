import { test, expect } from '@playwright/test';

test('🔍 Buscar elementos reales de la página', async ({ page }) => {
  await page.goto('https://automationintesting.online');
  await page.waitForLoadState('networkidle');
  
  console.log('=== BUSCANDO ELEMENTOS REALES ===');
  
  // Buscar todos los botones y sus textos
  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count();
  console.log(`Total botones: ${buttonCount}`);
  
  for (let i = 0; i < buttonCount; i++) {
    const btn = allButtons.nth(i);
    const text = await btn.textContent() || 'sin texto';
    const id = await btn.getAttribute('id') || 'sin id';
    const className = await btn.getAttribute('class') || 'sin class';
    
    console.log(`Botón ${i}: texto="${text.trim()}", id="${id}", class="${className}"`);
  }
  
  // Buscar elementos relacionados con rooms/habitaciones
  const roomElements = page.locator('*:has-text("room"), *:has-text("Room"), *:has-text("Book")');
  const roomCount = await roomElements.count();
  console.log(`\nElementos relacionados con rooms: ${roomCount}`);
  
  // Buscar elementos de booking
  const bookingElements = page.locator('*:has-text("book"), *:has-text("Book"), *:has-text("booking")');
  const bookingCount = await bookingElements.count();
  console.log(`Elementos relacionados con booking: ${bookingCount}`);
  
  // Verificar estructura de la página
  const sections = page.locator('section, div[id]');
  const sectionCount = await sections.count();
  console.log(`\nSecciones encontradas: ${sectionCount}`);
  
  for (let i = 0; i < Math.min(sectionCount, 10); i++) {
    const section = sections.nth(i);
    const id = await section.getAttribute('id') || 'sin id';
    const className = await section.getAttribute('class') || 'sin class';
    
    if (id !== 'sin id' || className.includes('room') || className.includes('book')) {
      console.log(`Sección ${i}: id="${id}", class="${className}"`);
    }
  }
  
  // Scrollear para ver si hay más contenido
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Buscar de nuevo después del scroll
  const afterScrollButtons = page.locator('button');
  const afterScrollCount = await afterScrollButtons.count();
  console.log(`\nBotones después del scroll: ${afterScrollCount}`);
  
  if (afterScrollCount > buttonCount) {
    for (let i = buttonCount; i < afterScrollCount; i++) {
      const btn = afterScrollButtons.nth(i);
      const text = await btn.textContent() || 'sin texto';
      const id = await btn.getAttribute('id') || 'sin id';
      
      console.log(`Nuevo botón ${i}: texto="${text.trim()}", id="${id}"`);
    }
  }
});
