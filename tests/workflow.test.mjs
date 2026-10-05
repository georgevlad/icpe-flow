import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createInitialState, SEED_STATE } from '../server/seed.mjs';
import { applyAction, WorkflowError } from '../server/workflow.mjs';
import { createStore, persistState } from '../server/store.mjs';
import { startServer } from '../server/index.mjs';
import { createApiServer } from '../server/app.mjs';

const time = '2026-10-08T10:00:00.000Z';
const stepsToPreparation = ['accept-change', 'implement', 'run-test', 'remediate', 'retest'];
const completeSteps = [...stepsToPreparation, 'attach-test', 'attach-manual', 'handover'];
const serviceSteps = ['service-classify', 'service-schedule', 'service-record-visit', 'service-verify', 'service-close'];
const offerSteps = ['offer-review', 'offer-clarify', 'offer-draft', 'offer-feedback', 'offer-revise', 'offer-accept', 'offer-start'];
const labSteps = ['lab-plan', 'lab-collect', 'lab-receive', 'lab-analyze', 'lab-review', 'lab-issue'];

async function temporaryState(t) {
  const directory = await mkdtemp(join(tmpdir(), 'icpe-demo-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return join(directory, 'state.json');
}

test('complete demonstration preserves revision history and exact delivered package', () => {
  const seed = createInitialState();
  let state = seed;
  for (const action of completeSteps) state = applyAction(state, action, time);
  assert.equal(state.stage, 'delivered');
  assert.equal(state.revision, 2);
  assert.deepEqual(state.observation, { id: 'DEMO-OBS-001', status: 'closed' });
  assert.deepEqual(state.attachments, { test: true, manualRevision: 2 });
  assert.deepEqual(state.deliveredPackage, {
    id: 'DEMO-PACHET-001',
    at: time,
    documents: [
      { code: 'DEMO-F01', revision: '01' },
      { code: 'DEMO-CER-001', revision: '02' },
      { code: 'DEMO-LS-001', revision: '02' },
      { code: 'DEMO-MOD-001', revision: '01' },
      { code: 'DEMO-TEST-001', revision: '02' },
      { code: 'DEMO-MAN-001', revision: '02' },
    ],
  });
  assert.deepEqual(state.history.map(({ action }) => action), ['open', 'design', ...completeSteps]);
  assert.equal(new Set(state.history.map(({ id }) => id)).size, 10);
  assert.deepEqual(seed, createInitialState());
  assert.equal(SEED_STATE.revision, 1);
  assert.ok(Object.isFrozen(SEED_STATE.attachments));
});

test('post-handover intervention is independent, ordered, and keeps a traceable report', () => {
  let state = createInitialState();
  assert.throws(() => applyAction(state, 'service-record-visit', time), { status: 409 });
  for (const action of serviceSteps) state = applyAction(state, action, time);
  assert.equal(state.service.stage, 'closed');
  assert.equal(state.stage, 'change', 'the existing project is untouched');
  assert.equal(state.history.length, 2);
  assert.deepEqual(state.service.history.map(({ action }) => action), ['service-report', ...serviceSteps]);
  assert.equal(new Set(state.service.history.map(({ id }) => id)).size, 6);
  assert.match(state.service.intervention.finding, /Actualizarea datelor/);
  assert.equal(state.service.verification.by, 'Persoana F');
  assert.equal(state.service.clientConfirmation.at, time);
  for (const action of serviceSteps) assert.throws(() => applyAction(state, action, time), { status: 409 });
  assert.throws(() => applyAction(state, 'service-unknown', time), { status: 400 });
});

test('inquiry becomes an accepted offer and a traceable project kickoff', () => {
  let state = createInitialState();
  assert.throws(() => applyAction(state, 'offer-draft', time), { status: 409 });
  for (const action of offerSteps) state = applyAction(state, action, time);
  assert.equal(state.offer.stage, 'started');
  assert.equal(state.offer.versions.length, 2);
  assert.equal(state.offer.versions[0].amountLei, 48_000);
  assert.equal(state.offer.versions[1].amountLei, 52_000);
  assert.equal(state.offer.versions[0].scope.length + 1, state.offer.versions[1].scope.length);
  assert.equal(state.offer.accepted.revision, '02');
  assert.deepEqual(state.offer.project, {
    id: 'DEMO-L-004', at: time, coordinator: 'Persoana G', acceptedOfferRevision: '02',
    handoffItems: ['Solicitarea DEMO-SOL-001', 'Clarificările consemnate', 'DEMO-OF-001 rev. 02 acceptată'],
    openPoint: 'Lista finală de semnale se confirmă la deschiderea lucrării.',
  });
  assert.deepEqual(state.offer.history.map(({ action }) => action), ['offer-request', ...offerSteps]);
  assert.equal(state.stage, 'change');
  assert.equal(state.service.stage, 'reported');
  for (const action of offerSteps) assert.throws(() => applyAction(state, action, time), { status: 409 });
  assert.throws(() => applyAction(state, 'offer-unknown', time), { status: 400 });
});

test('one identified sample moves through analysis and a reviewed report', () => {
  let state = createInitialState();
  assert.throws(() => applyAction(state, 'lab-analyze', time), { status: 409 });
  for (const action of labSteps) state = applyAction(state, action, time);
  assert.equal(state.lab.stage, 'issued');
  assert.equal(state.lab.sample.id, 'DEMO-PROBA-001');
  assert.equal(state.lab.receipt.receivedBy, 'Persoana I');
  assert.equal(state.lab.review.reviewedBy, 'Persoana J');
  assert.deepEqual(state.lab.report, {
    id: 'DEMO-RAP-LAB-001', revision: '01', at: time,
    recipient: 'Operator Apă Exemplu', sampleId: 'DEMO-PROBA-001',
    results: [{ indicator: 'pH', value: '7,2', unit: '—' }, { indicator: 'Conductivitate', value: '540', unit: 'µS/cm' }],
  });
  assert.notStrictEqual(state.lab.report.results, state.lab.analysis.results, 'the issued report has its own snapshot');
  assert.deepEqual(state.lab.history.map(({ action }) => action), ['lab-request', ...labSteps]);
  assert.equal(state.stage, 'change');
  assert.equal(state.service.stage, 'reported');
  assert.equal(state.offer.stage, 'received');
  for (const action of labSteps) assert.throws(() => applyAction(state, action, time), { status: 409 });
  assert.throws(() => applyAction(state, 'lab-unknown', time), { status: 400 });
});

test('valid version 1 progress migrates without losing the project; service persists and resets', async (t) => {
  const statePath = await temporaryState(t);
  let oldState = createInitialState();
  oldState = applyAction(oldState, 'accept-change', time);
  delete oldState.service;
  delete oldState.offer;
  delete oldState.lab;
  oldState.schemaVersion = 1;
  await writeFile(statePath, JSON.stringify(oldState), 'utf8');
  const store = await createStore({ statePath, now: () => new Date(time) });
  const upgraded = await store.getState();
  assert.equal(upgraded.schemaVersion, 4);
  assert.equal(upgraded.stage, 'implementation');
  assert.equal(upgraded.service.stage, 'reported');
  assert.equal(upgraded.offer.stage, 'received');
  assert.equal(upgraded.lab.stage, 'requested');
  assert.deepEqual(JSON.parse(await readFile(statePath, 'utf8')), upgraded);
  await store.dispatch('service-classify');
  const reloaded = await createStore({ statePath });
  assert.equal((await reloaded.getState()).service.stage, 'classified');
  assert.equal((await reloaded.getState()).stage, 'implementation');
  assert.deepEqual(await reloaded.reset(), createInitialState());
});

test('version 2 service progress migrates and remains independent of offer progress', async (t) => {
  const statePath = await temporaryState(t);
  let oldState = applyAction(createInitialState(), 'service-classify', time);
  delete oldState.offer;
  delete oldState.lab;
  oldState.schemaVersion = 2;
  await writeFile(statePath, JSON.stringify(oldState), 'utf8');
  const store = await createStore({ statePath, now: () => new Date(time) });
  const upgraded = await store.getState();
  assert.equal(upgraded.schemaVersion, 4);
  assert.equal(upgraded.service.stage, 'classified');
  assert.equal(upgraded.offer.stage, 'received');
  assert.equal(upgraded.lab.stage, 'requested');
  assert.deepEqual(JSON.parse(await readFile(statePath, 'utf8')), upgraded);
  await store.dispatch('offer-review');
  const reloaded = await createStore({ statePath });
  assert.equal((await reloaded.getState()).offer.stage, 'clarification');
  assert.equal((await reloaded.getState()).service.stage, 'classified');
});

test('version 3 offer progress migrates without changing the existing scenarios', async (t) => {
  const statePath = await temporaryState(t);
  let oldState = applyAction(createInitialState(), 'offer-review', time);
  oldState = applyAction(oldState, 'service-classify', time);
  delete oldState.lab;
  oldState.schemaVersion = 3;
  await writeFile(statePath, JSON.stringify(oldState), 'utf8');
  const store = await createStore({ statePath, now: () => new Date(time) });
  const upgraded = await store.getState();
  assert.equal(upgraded.schemaVersion, 4);
  assert.equal(upgraded.offer.stage, 'clarification');
  assert.equal(upgraded.service.stage, 'classified');
  assert.equal(upgraded.lab.stage, 'requested');
  assert.deepEqual(JSON.parse(await readFile(statePath, 'utf8')), upgraded);
  await store.dispatch('lab-plan');
  const reloaded = await createStore({ statePath });
  assert.equal((await reloaded.getState()).lab.stage, 'planned');
  assert.equal((await reloaded.getState()).offer.stage, 'clarification');
});

test('premature transitions, duplicate actions and post-delivery changes are blocked', () => {
  let state = createInitialState();
  const conflict = (action) => assert.throws(() => applyAction(state, action), (error) => error instanceof WorkflowError && error.status === 409);
  for (const action of completeSteps.slice(1)) conflict(action);
  state = applyAction(state, 'accept-change', time);
  conflict('accept-change');
  conflict('run-test');
  state = applyAction(state, 'implement', time);
  assert.equal(state.attachments.manualRevision, 1, 'available manual must not be silently attached');
  conflict('retest');
  state = applyAction(state, 'run-test', time);
  assert.equal(state.observation.status, 'open');
  conflict('retest');
  state = applyAction(state, 'remediate', time);
  assert.equal(state.observation.status, 'awaiting-retest');
  conflict('attach-test');
  conflict('handover');
  state = applyAction(state, 'retest', time);
  conflict('handover');
  state = applyAction(state, 'attach-manual', time);
  conflict('handover');
  conflict('attach-manual');
  state = applyAction(state, 'attach-test', time);
  conflict('attach-test');
  state = applyAction(state, 'handover', time);
  for (const action of completeSteps) conflict(action);
  assert.throws(() => applyAction(state, '__proto__'), { status: 400 });
  assert.throws(() => applyAction(state, 'unknown'), { status: 400 });
});

test('persistence survives reloading, serializes changes and resets to independent seed', async (t) => {
  const statePath = await temporaryState(t);
  const store = await createStore({ statePath, now: () => new Date(time) });
  for (const action of stepsToPreparation) await store.dispatch(action);
  await Promise.all([store.dispatch('attach-test'), store.dispatch('attach-manual')]);
  await store.dispatch('handover');
  const persisted = JSON.parse(await readFile(statePath, 'utf8'));
  const reloaded = await createStore({ statePath });
  assert.deepEqual(await reloaded.getState(), persisted);
  assert.equal(persisted.history.length, 10);
  const returned = await reloaded.getState();
  returned.attachments.test = false;
  assert.equal((await reloaded.getState()).attachments.test, true, 'callers cannot mutate stored state');
  assert.deepEqual(await reloaded.reset(), createInitialState());
  const resetReload = await createStore({ statePath });
  assert.deepEqual(await resetReload.getState(), createInitialState());
});

test('concurrent duplicate requests apply exactly once and failed transition does not poison queue', async (t) => {
  const statePath = await temporaryState(t);
  const store = await createStore({ statePath });
  const results = await Promise.allSettled([store.dispatch('accept-change'), store.dispatch('accept-change')]);
  assert.equal(results[0].status, 'fulfilled');
  assert.equal(results[1].status, 'rejected');
  assert.equal(results[1].reason.status, 409);
  const next = await store.dispatch('implement');
  assert.equal(next.stage, 'testing');
  assert.equal(next.history.length, 4);
});

test('disk write failure does not publish an unsaved action, and retry can succeed', async (t) => {
  const statePath = await temporaryState(t);
  let fail = false;
  const store = await createStore({
    statePath,
    persist: async (path, state) => {
      if (fail) throw new Error('simulated disk failure');
      await persistState(path, state);
    },
  });
  fail = true;
  await assert.rejects(store.dispatch('accept-change'), /simulated disk failure/);
  assert.deepEqual(await store.getState(), createInitialState());
  assert.deepEqual(JSON.parse(await readFile(statePath, 'utf8')), createInitialState());
  fail = false;
  assert.equal((await store.dispatch('accept-change')).stage, 'implementation');
});

test('invalid saved data fails explicitly and is never silently overwritten', async (t) => {
  const statePath = await temporaryState(t);
  const corrupted = { ...createInitialState(), stage: 'delivered' };
  await writeFile(statePath, JSON.stringify(corrupted), 'utf8');
  await assert.rejects(createStore({ statePath }), /inconsistent/);
  assert.deepEqual(JSON.parse(await readFile(statePath, 'utf8')), corrupted);
});

test('HTTP API handles errors, complete flow, reload and reset with the same contract', async (t) => {
  const statePath = await temporaryState(t);
  const { server, port } = await startServer({ statePath, port: 0 });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${port}`;
  const action = (type) => fetch(`${url}/api/actions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }),
  });
  let response = await fetch(`${url}/api/state`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), createInitialState());
  response = await action('handover');
  assert.equal(response.status, 409);
  assert.equal(typeof (await response.json()).error, 'string');
  for (const body of ['{', '{}', 'null', '[]', '{"type":42}', '{"type":"accept-change","extra":true}']) {
    response = await fetch(`${url}/api/actions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, 'string');
  }
  assert.equal((await action('unknown')).status, 400);
  assert.equal((await fetch(`${url}/api/unknown`)).status, 404);
  assert.equal((await fetch(`${url}/api/actions`, { method: 'POST', body: '{}' })).status, 400);
  for (const type of completeSteps) {
    response = await action(type);
    assert.equal(response.status, 200, type);
  }
  const delivered = await response.json();
  assert.equal(delivered.stage, 'delivered');
  assert.deepEqual(await (await fetch(`${url}/api/state`)).json(), delivered);
  assert.deepEqual(await (await createStore({ statePath })).getState(), delivered);
  response = await fetch(`${url}/api/reset`, { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), createInitialState());
});

test('HTTP API reports persistence errors as 500, never a successful transition', async (t) => {
  const server = createApiServer({
    store: { dispatch: async () => { throw new Error('disk full'); } },
    logError: () => {},
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/actions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"accept-change"}',
  });
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /nu a fost confirmată/);
});
