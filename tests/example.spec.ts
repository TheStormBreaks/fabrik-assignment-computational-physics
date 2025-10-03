import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000'); 
});

//Test 1: Initialization
test('1. renders checkboxes and START button initially', async ({ page }) => {
 
  const checkboxes = await page.getByRole('checkbox').all();
  expect(checkboxes.length).toBe(3);

  await expect(page.getByRole('button', { name: 'START' })).toBeVisible();
});

//Test 2: Initialization
test('2. verifies initial default checkbox states (1 checked, 2 checked, 3 unchecked)', async ({ page }) => {
  const physics1Checkbox = page.getByRole('checkbox', { name: /physics # 1/i });
  const physics2Checkbox = page.getByRole('checkbox', { name: /physics # 2/i });
  const physics3Checkbox = page.getByRole('checkbox', { name: /physics # 3/i });

  await expect(physics1Checkbox).toBeChecked();
  await expect(physics2Checkbox).toBeChecked();
  await expect(physics3Checkbox).not.toBeChecked();
});

//Test 3: User Interaction
test('3. allows changing checkbox selection before starting', async ({ page }) => {
  const physics3Checkbox = page.getByRole('checkbox', { name: /physics # 3/i });
  
  await expect(physics3Checkbox).not.toBeChecked();

  //click interaction
  await physics3Checkbox.check(); 
  await expect(physics3Checkbox).toBeChecked();

  //START button
  await page.getByRole('button', { name: /start/i }).click();

  //should be disabled after starting
  await expect(physics3Checkbox).toBeDisabled();
  await expect(physics3Checkbox).toBeChecked();
});

//Test 4: Negative Control
test('4. disables checkboxes after clicking start', async ({ page }) => {
  const startButton = page.getByRole('button', { name: /start/i });
  await startButton.click();

  const checkboxes = await page.getByRole('checkbox').all();
  for (const cb of checkboxes) {
    await expect(cb).toBeDisabled();
  }
});

//Test 5: Simulation
test('5. switches start to restart button after running', async ({ page }) => {
  await page.getByRole('button', { name: /start/i }).click();

  await expect(page.getByRole('button', { name: /restart/i })).toBeVisible();
  
  await expect(page.getByRole('button', { name: 'START', exact: true })).not.toBeAttached();
});

//est 6 & 7: State Reset
test('6 & 7. resets to start, re-enables controls after clicking restart', async ({ page }) => {
  await page.getByRole('button', { name: /start/i }).click();

  const checkboxesBeforeRestart = await page.getByRole('checkbox').all();
  for (const cb of checkboxesBeforeRestart) {
    await expect(cb).toBeDisabled();
  }

  await page.getByRole('button', { name: /restart/i }).click();

  // Wait for the START button to be visible again, indicating the reset is complete
  const startButton = page.getByRole('button', { name: /start/i });
  await expect(startButton).toBeVisible();

  const checkboxesAfterRestart = await page.getByRole('checkbox').all();
  for (const cb of checkboxesAfterRestart) {
    await expect(cb).toBeEnabled();
  }
});

//Test 8  9: Durability
test('8 & 9. full start to restart cycle executes twice properly', async ({ page }) => {
  
  let startButton = page.getByRole('button', { name: /start/i });
  await startButton.click();
  
  let restartButton = page.getByRole('button', { name: /restart/i });
  await expect(restartButton).toBeVisible();
  await restartButton.click();
  
  // Wait for reset to complete
  startButton = page.getByRole('button', { name: /start/i });
  await expect(startButton).toBeVisible();
  await expect(startButton).toBeEnabled();

  await startButton.click();
  
  restartButton = page.getByRole('button', { name: /restart/i });
  await expect(restartButton).toBeVisible();
  await expect(page.getByRole('button', { name: 'START', exact: true })).not.toBeAttached();
});

//Test 10: Canvas Element
test('10. physics canvas element is rendered', async ({ page }) => {
  const canvasElement = page.locator('canvas'); 
  
  await expect(canvasElement).toBeVisible();
});