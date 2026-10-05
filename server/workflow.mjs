import { applyServiceAction } from './service.mjs';
import { applyOfferAction } from './offer.mjs';
import { applyLabAction } from './laboratory.mjs';

export class WorkflowError extends Error {
  constructor(message, status = 409) {
    super(message);
    this.name = 'WorkflowError';
    this.status = status;
  }
}

const actions = {
  'accept-change': {
    stage: 'change',
    title: 'Modificare acceptată în simulare',
    detail: 'Denumirile „Funcționare” și „Indisponibil” au fost acceptate demonstrativ. Cerințele, lista semnalelor și fișa de teste trec la rev. 02. Persoana C primește sarcina de implementare.',
    update(state) {
      state.revision = 2;
      state.stage = 'implementation';
    },
  },
  implement: {
    stage: 'implementation',
    title: 'Implementare consemnată',
    detail: 'Persoana C confirmă implementarea demonstrativă conform rev. 02. Instrucțiunile DEMO-MAN-001 rev. 02 sunt disponibile pentru verificare; pachetul de predare păstrează încă rev. 01.',
    update(state) {
      state.stage = 'testing';
    },
  },
  'run-test': {
    stage: 'testing',
    title: 'Test efectuat · observație deschisă',
    detail: 'Testul demonstrativ găsește denumirea anterioară în loc de „Indisponibil”. DEMO-OBS-001 este deschisă pentru Persoana C. Instrucțiunile rev. 02 corespund cerințelor.',
    update(state) {
      state.observation = { id: 'DEMO-OBS-001', status: 'open' };
      state.stage = 'remediation';
    },
  },
  remediate: {
    stage: 'remediation',
    title: 'Remediere și dovadă consemnate',
    detail: 'Persoana C consemnează corectarea etichetei și atașarea unei capturi demonstrative. DEMO-OBS-001 rămâne de retestat; remedierea nu închide observația.',
    update(state) {
      state.observation.status = 'awaiting-retest';
      state.stage = 'retesting';
    },
  },
  retest: {
    stage: 'retesting',
    title: 'Retestare confirmată · observație închisă',
    detail: 'Persoana D confirmă în simulare corespondența cu DEMO-CER-001 rev. 02. DEMO-OBS-001 este închisă. Fișa finală de test este disponibilă pentru atașare.',
    update(state) {
      state.observation.status = 'closed';
      state.stage = 'preparation';
    },
  },
  'attach-test': {
    stage: 'preparation',
    title: 'Fișa finală de test atașată',
    detail: 'DEMO-TEST-001 rev. 02, cu remedierea și retestarea consemnate, a fost inclusă în pachetul demonstrativ de predare.',
    validate(state) {
      if (state.attachments.test) throw new WorkflowError('Fișa finală de test este deja atașată.');
    },
    update(state) {
      state.attachments.test = true;
    },
  },
  'attach-manual': {
    stage: 'preparation',
    title: 'Instrucțiunile finale atașate',
    detail: 'DEMO-MAN-001 rev. 02 înlocuiește rev. 01 în pachetul demonstrativ de predare. Revizia anterioară rămâne consultabilă.',
    validate(state) {
      if (state.attachments.manualRevision === 2) throw new WorkflowError('Instrucțiunile finale sunt deja atașate.');
    },
    update(state) {
      state.attachments.manualRevision = 2;
    },
  },
  handover: {
    stage: 'preparation',
    title: 'Predare documentară simulată',
    detail: 'Pachetul DEMO-PACHET-001 a fost păstrat cu reviziile transmise. Confirmarea este demonstrativă și nu certifică recepția tehnică sau obligații contractuale.',
    validate(state) {
      if (!state.attachments.test || state.attachments.manualRevision !== 2 || state.observation?.status !== 'closed') {
        throw new WorkflowError('Predarea cere fișa finală de test, instrucțiunile rev. 02 și observația închisă prin retestare.');
      }
    },
    update(state, at) {
      state.stage = 'delivered';
      state.deliveredPackage = {
        id: 'DEMO-PACHET-001',
        at,
        documents: [
          { code: 'DEMO-F01', revision: '01' },
          { code: 'DEMO-CER-001', revision: '02' },
          { code: 'DEMO-LS-001', revision: '02' },
          { code: 'DEMO-MOD-001', revision: '01' },
          { code: 'DEMO-TEST-001', revision: '02' },
          { code: 'DEMO-MAN-001', revision: '02' },
        ],
      };
    },
  },
};

export function applyAction(current, type, at = new Date().toISOString()) {
  if (typeof type === 'string' && type.startsWith('service-')) return applyServiceAction(current, type, at);
  if (typeof type === 'string' && type.startsWith('offer-')) return applyOfferAction(current, type, at);
  if (typeof type === 'string' && type.startsWith('lab-')) return applyLabAction(current, type, at);
  if (typeof type !== 'string' || !Object.hasOwn(actions, type)) {
    throw new WorkflowError('Acțiune necunoscută.', 400);
  }
  const action = actions[type];
  if (current.stage !== action.stage) {
    throw new WorkflowError('Acțiunea nu este disponibilă în etapa curentă a simulării.');
  }
  action.validate?.(current);
  const state = structuredClone(current);
  action.update(state, at);
  state.history.push({
    id: `DEMO-EVT-${String(state.history.length + 1).padStart(3, '0')}`,
    action: type,
    title: action.title,
    detail: action.detail,
    at,
  });
  return state;
}

// Replay makes a damaged or manually inconsistent state fail visibly on startup.
export function validatePersistedState(value, initialState) {
  if (!value || ![1, 2, 3, 4].includes(value.schemaVersion) || !Array.isArray(value.history)) {
    throw new Error('Fișierul de stare are un format neacceptat.');
  }
  const savedVersion = value.schemaVersion;
  let expected = structuredClone(initialState);
  expected.schemaVersion = savedVersion;
  if (savedVersion < 2) delete expected.service;
  if (savedVersion < 3) delete expected.offer;
  if (savedVersion < 4) delete expected.lab;
  for (const event of value.history.slice(initialState.history.length)) {
    if (!event || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) {
      throw new Error('Istoricul din fișierul de stare nu este valid.');
    }
    expected = applyAction(expected, event.action, event.at);
  }
  if (savedVersion >= 2) {
    if (!value.service || !Array.isArray(value.service.history)) {
      throw new Error('Istoricul intervenției nu este valid.');
    }
    for (const event of value.service.history.slice(initialState.service.history.length)) {
      if (!event || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) {
        throw new Error('Istoricul intervenției nu este valid.');
      }
      expected = applyAction(expected, event.action, event.at);
    }
  }
  if (savedVersion >= 3) {
    if (!value.offer || !Array.isArray(value.offer.history)) {
      throw new Error('Istoricul ofertării nu este valid.');
    }
    for (const event of value.offer.history.slice(initialState.offer.history.length)) {
      if (!event || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) {
        throw new Error('Istoricul ofertării nu este valid.');
      }
      expected = applyAction(expected, event.action, event.at);
    }
  }
  if (savedVersion >= 4) {
    if (!value.lab || !Array.isArray(value.lab.history)) {
      throw new Error('Istoricul laboratorului nu este valid.');
    }
    for (const event of value.lab.history.slice(initialState.lab.history.length)) {
      if (!event || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) {
        throw new Error('Istoricul laboratorului nu este valid.');
      }
      expected = applyAction(expected, event.action, event.at);
    }
  }
  if (JSON.stringify(value) !== JSON.stringify(expected)) {
    throw new Error('Fișierul de stare este inconsistent cu istoricul simulării.');
  }
  if (savedVersion === 4) return value;
  return {
    ...value,
    schemaVersion: 4,
    ...(savedVersion < 2 ? { service: structuredClone(initialState.service) } : {}),
    ...(savedVersion < 3 ? { offer: structuredClone(initialState.offer) } : {}),
    lab: structuredClone(initialState.lab),
  };
}
