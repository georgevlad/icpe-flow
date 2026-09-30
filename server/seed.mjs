const seed = {
  schemaVersion: 1,
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

