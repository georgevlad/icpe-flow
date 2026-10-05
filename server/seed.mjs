const seed = {
  schemaVersion: 4,
  stage: 'change',
  revision: 1,
  observation: null,
  attachments: { test: false, manualRevision: 1 },
  history: [
    {
      id: 'DEMO-EVT-001',
      action: 'open',
      title: 'Dosar demonstrativ deschis',
      detail: 'DEMO-L-001 · Colibița. Domeniul fictiv și datele de intrare au fost consemnate de coordonator.',
      at: '2026-10-01T07:00:00.000Z',
    },
    {
      id: 'DEMO-EVT-002',
      action: 'design',
      title: 'Proiectare demonstrativă parcursă',
      detail: 'DEMO-CER-001 și DEMO-LS-001, rev. 01, sunt disponibile. Solicitarea DEMO-MOD-001 așteaptă decizia simulată.',
      at: '2026-10-02T09:30:00.000Z',
    },
  ],
  deliveredPackage: null,
  service: {
    id: 'DEMO-SRV-001',
    stage: 'reported',
    assignee: null,
    scheduledAt: null,
    intervention: null,
    verification: null,
    clientConfirmation: null,
    history: [{
      id: 'DEMO-SRV-EVT-001',
      action: 'service-report',
      title: 'Sesizare demonstrativă primită',
      detail: 'Beneficiarul fictiv raportează că interfața nu arată ultima actualizare pentru echipamentul DEMO-TA-002. Cazul este legat de predarea anterioară DEMO-PV-002.',
      at: '2026-10-03T08:00:00.000Z',
    }],
  },
  offer: {
    id: 'DEMO-SOL-001',
    stage: 'received',
    reviewedAt: null,
    clarification: null,
    versions: [],
    feedback: null,
    accepted: null,
    project: null,
    history: [{
      id: 'DEMO-OF-EVT-001',
      action: 'offer-request',
      title: 'Solicitare demonstrativă primită',
      detail: 'Operator Apă Exemplu solicită o propunere pentru modernizarea monitorizării stației fictive Orizont. Datele tehnice sunt încă preliminare.',
      at: '2026-10-04T08:00:00.000Z',
    }],
  },
  lab: {
    id: 'DEMO-LAB-001',
    stage: 'requested',
    plannedAt: null,
    sample: null,
    receipt: null,
    analysis: null,
    review: null,
    report: null,
    history: [{
      id: 'DEMO-LAB-EVT-001',
      action: 'lab-request',
      title: 'Cerere de analiză demonstrativă primită',
      detail: 'Operator Apă Exemplu solicită valori pentru pH și conductivitate la un punct fictiv al stației Nord. Nu există încă o probă recoltată.',
      at: '2026-10-05T08:00:00.000Z',
    }],
  },
};

function freezeDeep(value) {
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') freezeDeep(child);
  }
  return Object.freeze(value);
}

export const SEED_STATE = freezeDeep(seed);

export function createInitialState() {
  return structuredClone(SEED_STATE);
}

