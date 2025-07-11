import { test, expect } from '@playwright/test';

test('🔍 Inspeccionar locators de la página', async ({ page }) => {
  await page.goto('https://automationintesting.online');
  await page.waitForLoadState('networkidle');
  
  console.log('=== INSPECCIONANDO PÁGINA ===');
  
  // Buscar elementos de contacto
  const contactElements = await page.locator('[data-testid*="Contact"]').count();
  console.log(`Elementos con data-testid Contact: ${contactElements}`);
  
  // Buscar sección de contacto
  const contactSection = await page.locator('#contact').count();
  console.log(`Sección #contact encontrada: ${contactSection}`);
  
  // Buscar campos de formulario
  const nameInput = await page.locator('input[placeholder*="Name"], input[name*="name"], [data-testid="ContactName"]').count();
  console.log(`Campo nombre encontrado: ${nameInput}`);
  
  const emailInput = await page.locator('input[type="email"], input[placeholder*="Email"], [data-testid="ContactEmail"]').count();
  console.log(`Campo email encontrado: ${emailInput}`);
  
  // Tomar screenshot para análisis
  await page.screenshot({ 
    path: 'test-results/page-inspection.png',
    fullPage: true 
  });
  
  // Listar todos los inputs visibles
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log(`Total inputs encontrados: ${inputCount}`);
  
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const placeholder = await input.getAttribute('placeholder') || 'sin placeholder';
    const name = await input.getAttribute('name') || 'sin name';
    const id = await input.getAttribute('id') || 'sin id';
    const testId = await input.getAttribute('data-testid') || 'sin data-testid';
    
    console.log(`Input ${i}: placeholder="${placeholder}", name="${name}", id="${id}", data-testid="${testId}"`);
  }
  
  // Verificar si existe el formulario de contacto
  const forms = page.locator('form');
  const formCount = await forms.count();
  console.log(`Formularios encontrados: ${formCount}`);
  
  // Verificar botones
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  console.log(`Botones encontrados: ${buttonCount}`);
});
