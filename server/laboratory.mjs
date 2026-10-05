import { WorkflowError } from './workflow.mjs';

export const LAB_ACTIONS = {
  'lab-plan': {
    stage: 'requested',
    title: 'Recoltare planificată',
    detail: 'Cererea fictivă DEMO-LAB-001 este legată de un punct de recoltare demonstrativ și de indicatorii solicitați. Persoana H este desemnată pentru prelevare.',
    update(lab, at) {
      lab.stage = 'planned';
      lab.plannedAt = at;
    },
  },
  'lab-collect': {
    stage: 'planned',
    title: 'Probă recoltată și identificată',
    detail: 'Persoana H consemnează proba fictivă DEMO-PROBA-001, punctul de recoltare și momentul prelevării. Identificatorul urmărește proba până la raport.',
    update(lab, at) {
      lab.stage = 'collected';
      lab.sample = {
        id: 'DEMO-PROBA-001', at, collectedBy: 'Persoana H',
        source: 'Punct de recoltare fictiv · stația Nord',
      };
    },
  },
  'lab-receive': {
    stage: 'collected',
    title: 'Probă primită în laborator',
    detail: 'Primirea probei DEMO-PROBA-001 este consemnată demonstrativ. Persoana I confirmă identificatorul și starea înscrisă pe fișa fictivă de primire.',
    update(lab, at) {
      lab.stage = 'received';
      lab.receipt = { at, receivedBy: 'Persoana I', note: 'Identificator și stare consemnate în simulare.' };
    },
  },
  'lab-analyze': {
    stage: 'received',
    title: 'Rezultate demonstrative înregistrate',
    detail: 'Persoana I înregistrează două valori inventate pentru proba DEMO-PROBA-001. Ele nu provin dintr-o analiză reală și nu permit o concluzie de conformitate.',
    update(lab, at) {
      lab.stage = 'review';
      lab.analysis = {
        at, analyst: 'Persoana I',
        results: [
          { indicator: 'pH', value: '7,2', unit: '—' },
          { indicator: 'Conductivitate', value: '540', unit: 'µS/cm' },
        ],
      };
    },
  },
  'lab-review': {
    stage: 'review',
    title: 'Înregistrări verificate separat',
    detail: 'Persoana J verifică demonstrativ legătura dintre cerere, probă și rezultatele consemnate. Această acțiune nu reprezintă o validare științifică sau o aprobare reală de laborator.',
    update(lab, at) {
      lab.stage = 'ready';
      lab.review = { at, reviewedBy: 'Persoana J', note: 'Trasabilitatea înregistrărilor a fost verificată în simulare.' };
    },
  },
  'lab-issue': {
    stage: 'ready',
    title: 'Raport demonstrativ emis',
    detail: 'DEMO-RAP-LAB-001 rev. 01 păstrează proba, valorile inventate și verificarea separată. Emiterea este fictivă; nu se transmite un document real.',
    update(lab, at) {
      lab.stage = 'issued';
      lab.report = {
        id: 'DEMO-RAP-LAB-001', revision: '01', at,
        recipient: 'Operator Apă Exemplu', sampleId: lab.sample.id,
        results: structuredClone(lab.analysis.results),
      };
    },
  },
};

export function applyLabAction(current, type, at) {
  if (!Object.hasOwn(LAB_ACTIONS, type)) throw new WorkflowError('Acțiune necunoscută.', 400);
  const action = LAB_ACTIONS[type];
  if (current.lab.stage !== action.stage) {
    throw new WorkflowError('Acțiunea nu este disponibilă în etapa curentă a simulării de laborator.');
  }
  const state = structuredClone(current);
  action.update(state.lab, at);
  state.lab.history.push({
    id: `DEMO-LAB-EVT-${String(state.lab.history.length + 1).padStart(3, '0')}`,
    action: type, title: action.title, detail: action.detail, at,
  });
  return state;
}
