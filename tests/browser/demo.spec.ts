import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('demonstration: documents, complete workflow, persistence, mobile and reset', async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  const baseOrigin = new URL(test.info().project.use.baseURL as string).origin;
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', req => { if (!req.url().startsWith(baseOrigin) && !req.url().startsWith('data:')) externalRequests.push(req.url()); });
  await mkdir('artifacts', { recursive: true });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Patru trasee. Pași vizibili.' })).toBeVisible();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  await expect(page.getByRole('button', { name: 'Explorează dosarul' })).toBeVisible();
  await page.getByRole('button', { name: 'Închide notificarea' }).click();
  await page.screenshot({ path: 'artifacts/overview-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Explorează dosarul' }).click();
  await expect(page.getByRole('heading', { name: 'Două stări, fără ambiguități.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/dossier-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: /Documente/ }).click();
  for (let i = 0; i < 6; i++) {
    await page.locator('.document-row').nth(i).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.document-section').first()).toBeVisible();
    if (i === 5) await expect(page.getByRole('dialog')).toContainText('Proiect — predare neconsemnată');
    await page.getByRole('button', { name: 'Închide panoul', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Compară cerințele' }).click();
  await expect(page.getByRole('dialog')).toContainText('Propusă');
  await expect(page.locator('.state-label.removed')).toContainText('Oprit');
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Spațiu de lucru' }).click();
  await page.getByRole('button', { name: 'Analizează modificarea', exact: true }).click();
  await page.screenshot({ path: 'artifacts/change-comparison.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('dialog').getByRole('button', { name: 'Acceptă modificarea în simulare', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revizia nouă ajunge la execuție.' })).toBeVisible();
  await expect(page.locator('.dossier-metadata')).toContainText('Revizia 02');
  await page.getByRole('button', { name: 'Consemnează implementarea', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Consemnează implementarea', exact: true }).click();
  await page.getByRole('button', { name: 'Deschide fișa de test', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Înregistrează testul', exact: true }).click();
  await expect(page.locator('.observation-link')).toContainText('Deschisă');
  await page.getByRole('button', { name: 'Consemnează remedierea', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Înregistrează remedierea', exact: true }).click();
  await expect(page.locator('.observation-link')).toContainText('De retestat');
  await expect(page.getByRole('button', { name: 'Pregătește predarea', exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Continuă în dosar' }).click();
  await expect(page.getByRole('heading', { name: 'Remediată. Acum, de verificat.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/retest-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Deschide retestarea', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Confirmă retestarea', exact: true }).click();
  await expect(page.locator('.observation-link')).toContainText('Închisă prin retestare');
  await expect(page.getByRole('button', { name: 'Pregătește predarea', exact: true })).toHaveCount(0);
  await page.locator('.next-action .package-row').filter({ hasText: 'Fișă de test finală' }).getByRole('button', { name: 'Atașează', exact: true }).click();
  await expect(page.locator('.next-action .package-row').filter({ hasText: 'Fișă de test finală' })).toContainText('Rev. 02 atașată');
  await page.locator('.next-action .package-row').filter({ hasText: 'Instrucțiuni operator' }).getByRole('button', { name: 'Atașează', exact: true }).click();
  await page.getByRole('button', { name: 'Pregătește predarea', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Finalizează predarea demonstrativă', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Un dosar complet. O poveste clară.' })).toBeVisible();
  await page.getByRole('button', { name: 'Vezi procesul-verbal', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('DEMO-PACHET-001');
  await expect(page.getByRole('dialog')).toContainText('Predat în simulare');
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: /Istoric/ }).click();
  await expect(page.locator('.timeline article')).toHaveCount(10);
  await page.reload();
  await page.getByRole('button', { name: 'Continuă în dosar' }).click();
  await expect(page.getByRole('heading', { name: 'Un dosar complet. O poveste clară.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/delivered-desktop.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/dossier-mobile.png', fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Deschide navigarea' }).click();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  await expect(page.getByRole('button', { name: 'Închide navigarea', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Explorează dosarul' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/overview-mobile.png', fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const state = await (await page.request.get('/api/state')).json();
  expect(state).toMatchObject({ stage: 'change', revision: 1, observation: null, attachments: { test: false, manualRevision: 1 }, deliveredPackage: null });
  expect(state.history).toHaveLength(2);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('a stale decision resynchronizes the dossier after a conflict', async ({ page, request }) => {
  await request.post('/api/reset', { data: {} });
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorează dosarul' }).click();
  await page.getByRole('button', { name: 'Analizează modificarea', exact: true }).click();
  await request.post('/api/actions', { data: { type: 'accept-change' } });
  await page.getByRole('dialog').getByRole('button', { name: 'Acceptă modificarea în simulare', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('resincronizat');
  await expect(page.getByRole('heading', { name: 'Revizia nouă ajunge la execuție.' })).toBeVisible();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  await expect(page.getByRole('button', { name: 'Explorează dosarul' })).toBeVisible();
});

test('post-handover intervention updates the report, survives reload, and resets', async ({ page, request }) => {
  await mkdir('artifacts', { recursive: true });
  await request.post('/api/reset', { data: {} });
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorează intervenția' }).click();
  await expect(page.getByRole('heading', { name: 'Sesizare după predare.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/service-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: 'Raport' }).click();
  await expect(page.locator('.service-report')).toContainText('În așteptarea intervenției');
  await page.getByRole('tab', { name: 'Cazul' }).click();
  for (const label of ['Clasifică și atribuie', 'Programează verificarea', 'Consemnează intervenția', 'Confirmă verificarea', 'Consemnează confirmarea și închide']) {
    await page.getByRole('button', { name: label }).click();
  }
  await expect(page.getByRole('heading', { name: 'Sesizarea are un rezultat documentat.' })).toBeVisible();
  await page.getByRole('button', { name: 'Vezi raportul final' }).click();
  await expect(page.locator('.service-report')).toContainText('Persoana F');
  await expect(page.locator('.service-report')).toContainText('Primirea raportului confirmată');
  await page.reload();
  await page.getByRole('button', { name: 'Continuă intervenția' }).click();
  await page.getByRole('tab', { name: /Istoric/ }).click();
  await expect(page.locator('.timeline article')).toHaveCount(6);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/service-mobile.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Deschide navigarea' }).click();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  const state = await (await request.get('/api/state')).json();
  expect(state.service.stage).toBe('reported');
  expect(state.service.history).toHaveLength(1);
});

test('inquiry, quote revisions, acceptance and project kickoff stay traceable', async ({ page, request }) => {
  await mkdir('artifacts', { recursive: true });
  await request.post('/api/reset', { data: {} });
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorează ofertarea' }).click();
  await expect(page.getByRole('heading', { name: 'Din solicitare în lucrare.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/offer-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: /Oferte/ }).click();
  await expect(page.locator('.offer-version')).toHaveCount(2);
  await expect(page.locator('.offer-version').first()).toContainText('În așteptare');
  await page.getByRole('tab', { name: 'Traseu' }).click();
  for (const label of [
    'Analizează solicitarea', 'Consemnează clarificările', 'Pregătește oferta rev. 01',
    'Înregistrează cererea de ajustare', 'Pregătește oferta rev. 02',
    'Consemnează acceptarea rev. 02', 'Creează fișa de pornire',
  ]) await page.getByRole('button', { name: label }).click();
  await expect(page.getByRole('heading', { name: 'Informațiile au ajuns la coordonator.' })).toBeVisible();
  await page.getByRole('tab', { name: /Oferte/ }).click();
  await expect(page.locator('.offer-version').first()).toContainText('48.000 lei');
  await expect(page.locator('.offer-version').last()).toContainText('52.000 lei');
  await expect(page.locator('.offer-version').last()).toContainText('a doua sesiune de instruire');
  await page.screenshot({ path: 'artifacts/offer-revisions.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: 'Pornire' }).click();
  await expect(page.locator('.offer-handoff')).toContainText('DEMO-L-004');
  await expect(page.locator('.offer-handoff')).toContainText('DEMO-OF-001 rev. 02');
  await expect(page.locator('.offer-handoff')).toContainText('Lista finală de semnale');
  await page.screenshot({ path: 'artifacts/offer-handoff.png', fullPage: true, animations: 'disabled' });
  await page.reload();
  await page.getByRole('button', { name: 'Continuă ofertarea' }).click();
  await page.getByRole('tab', { name: /Istoric/ }).click();
  await expect(page.locator('.timeline article')).toHaveCount(8);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/offer-mobile.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Deschide navigarea' }).click();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  const state = await (await request.get('/api/state')).json();
  expect(state.offer.stage).toBe('received');
  expect(state.offer.versions).toHaveLength(0);
  expect(state.offer.history).toHaveLength(1);
});

test('sample, analysis and laboratory report keep the same sample identity', async ({ page, request }) => {
  await mkdir('artifacts', { recursive: true });
  await request.post('/api/reset', { data: {} });
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorează laboratorul' }).click();
  await expect(page.getByRole('heading', { name: 'De la probă la raport.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/lab-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: 'Probă și analiză' }).click();
  await expect(page.locator('.lab-document')).toContainText('Proba nu a fost recoltată');
  await page.getByRole('tab', { name: 'Flux' }).click();
  for (const label of [
    'Planifică recoltarea', 'Consemnează recoltarea', 'Înregistrează primirea',
    'Înregistrează rezultatele', 'Consemnează verificarea', 'Emite raportul demonstrativ',
  ]) await page.getByRole('button', { name: label }).click();
  await expect(page.getByRole('heading', { name: 'Raportul păstrează traseul probei.' })).toBeVisible();
  await page.getByRole('tab', { name: 'Probă și analiză' }).click();
  await expect(page.locator('.lab-document')).toContainText('DEMO-PROBA-001');
  await expect(page.locator('.lab-document')).toContainText('Persoana J');
  await page.getByRole('tab', { name: 'Raport' }).click();
  await expect(page.locator('.lab-document')).toContainText('DEMO-RAP-LAB-001');
  await expect(page.locator('.lab-document')).toContainText('DEMO-PROBA-001');
  await expect(page.locator('.lab-document')).toContainText('540');
  await expect(page.locator('.lab-document')).toContainText('Nu este buletin de analiză');
  await page.screenshot({ path: 'artifacts/lab-report.png', fullPage: true, animations: 'disabled' });
  await page.reload();
  await page.getByRole('button', { name: 'Continuă laboratorul' }).click();
  await page.getByRole('tab', { name: /Istoric/ }).click();
  await expect(page.locator('.timeline article')).toHaveCount(7);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/lab-mobile.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Deschide navigarea' }).click();
  await page.getByRole('button', { name: 'Resetează demonstrația' }).click();
  await page.getByRole('button', { name: 'Resetează acum' }).click();
  const state = await (await request.get('/api/state')).json();
  expect(state.lab.stage).toBe('requested');
  expect(state.lab.sample).toBeNull();
  expect(state.lab.report).toBeNull();
});

