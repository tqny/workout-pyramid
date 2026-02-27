import { expect, test } from '@playwright/test';

const STORE_KEY = 'workout_pyramid_store_v1';

function isoDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysToISO(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

function nextMondayISO() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - mondayOffset + 7);
  return isoDate(monday);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.removeItem(key);
    localStorage.removeItem('workout_pyramid_last_commit_check');
  }, { key: STORE_KEY });
});

test('loads dashboard and toggles week/month views', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Training today?')).toBeVisible();
  await page.getByRole('button', { name: 'Rest day' }).click();

  await expect(page.getByText('WORKOUT', { exact: true })).toBeVisible();
  await expect(page.getByText('PYRAMID')).toBeVisible();
  await expect(page.getByRole('button', { name: /Cloud/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Month', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Month', exact: true }).click();
  await expect(page.getByRole('button', { name: /Edit day/i })).toBeVisible();
  await expect(page.getByText('SELECTED DAY')).toBeVisible();

  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.getByText('Tap any day card to edit details.')).toBeVisible();
});

test('can plan today from commitment modal and mark done from month inspector', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Training today?')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, I am' }).click();
  await page.getByLabel('Workout start time').fill('18:30');
  await page.getByRole('button', { name: 'Commit time' }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await expect(page.getByText('Workout planned')).toBeVisible();

  await page.getByRole('button', { name: 'Mark done' }).click();
  await expect(page.getByText('Workout complete')).toBeVisible();

  const today = isoDate();
  const store = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}'), STORE_KEY);
  expect(store.days[today].status).toBe('completed');
  expect(store.days[today].completedAt).toBeTruthy();
});

test('opens day editor from week card and saves focus text', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Rest day' }).click();

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const day = today.toLocaleDateString('en-US', { day: 'numeric' });

  await page.getByRole('button', { name: `${weekday} ${month} ${day}, skipped` }).click();

  await page.getByRole('button', { name: 'Planned' }).click();
  await page.getByLabel('Workout start time').fill('07:45');
  await page.getByPlaceholder('e.g., Legs + mobility').fill('Upper body + mobility');
  await page.getByRole('button', { name: 'Save changes' }).click();

  const store = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}'), STORE_KEY);
  const todayISO = isoDate();
  expect(store.days[todayISO].status).toBe('planned');
  expect(store.days[todayISO].time).toBe('07:45');
  expect(store.days[todayISO].focus).toBe('Upper body + mobility');
});

test('month inspector actions are visible on mobile viewport', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Yes, I am' }).click();
  await page.getByLabel('Workout start time').fill('20:15');
  await page.getByRole('button', { name: 'Commit time' }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await expect(page.getByText('Tap a date to inspect it, then use the panel to update details.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark done' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip today' })).toBeVisible();
});

test('weekly review can apply next-week template plan', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Rest day' }).click();
  await page.getByRole('button', { name: 'Weekly review' }).click();

  await expect(page.getByLabel('Template start time')).toBeVisible();
  await page.getByLabel('Template start time').fill('06:20');
  await page.getByRole('button', { name: 'Apply next week plan' }).click();

  const store = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}'), STORE_KEY);
  const baseISO = nextMondayISO();
  const expected = [
    baseISO,
    addDaysToISO(baseISO, 2),
    addDaysToISO(baseISO, 4),
    addDaysToISO(baseISO, 5),
  ];

  for (const iso of expected) {
    expect(store.days[iso]?.status).toBe('planned');
    expect(store.days[iso]?.time).toBe('06:20');
  }
});
