import { WorkflowError } from './workflow.mjs';

export const SERVICE_ACTIONS = {
  'service-classify': {
    stage: 'reported',
    title: 'Sesizare clasificată și atribuită',
    detail: 'DEMO-SRV-001 este legată de echipamentul și predarea fictive. Persoana E preia coordonarea verificării; cauza rămâne de stabilit.',
    update(service) {
      service.stage = 'classified';
      service.assignee = 'Persoana E';
    },
  },
  'service-schedule': {
    stage: 'classified',
    title: 'Verificare programată',
    detail: 'Vizita demonstrativă este convenită cu beneficiarul. Persoana E are la îndemână sesizarea, referința predării și identificatorul echipamentului.',
    update(service, at) {
      service.stage = 'scheduled';
      service.scheduledAt = at;
    },
  },
  'service-record-visit': {
    stage: 'scheduled',
    title: 'Intervenție consemnată',
    detail: 'Persoana E consemnează o neconcordanță demonstrativă în afișarea actualizării datelor, acțiunea simulată și dovada. Cazul așteaptă o verificare separată.',
    update(service, at) {
      service.stage = 'verification';
      service.intervention = {
        at,
        finding: 'Actualizarea datelor nu apărea în interfața demonstrativă.',
        action: 'A fost corectată configurația demonstrativă de afișare.',
        evidence: 'Captură și notă de intervenție simulate.',
      };
    },
  },
  'service-verify': {
    stage: 'verification',
    title: 'Rezultat verificat separat',
    detail: 'Persoana F confirmă în simulare că afișarea se actualizează. Raportul de intervenție este pregătit pentru comunicarea către beneficiar.',
    update(service, at) {
      service.stage = 'confirmation';
      service.verification = { at, by: 'Persoana F', result: 'Afișarea actualizării datelor a fost confirmată în simulare.' };
    },
  },
  'service-close': {
    stage: 'confirmation',
    title: 'Confirmare consemnată · sesizare închisă',
    detail: 'Primirea raportului este confirmată demonstrativ de beneficiar. Sesizarea este închisă, cu pașii și referințele păstrate în istoric.',
    update(service, at) {
      service.stage = 'closed';
      service.clientConfirmation = { at, note: 'Primirea raportului confirmată demonstrativ de beneficiar.' };
    },
  },
};

export function applyServiceAction(current, type, at) {
  if (!Object.hasOwn(SERVICE_ACTIONS, type)) throw new WorkflowError('Acțiune necunoscută.', 400);
  const action = SERVICE_ACTIONS[type];
  if (current.service.stage !== action.stage) {
    throw new WorkflowError('Acțiunea nu este disponibilă în etapa curentă a intervenției.');
  }
  const state = structuredClone(current);
  action.update(state.service, at);
  state.service.history.push({
    id: `DEMO-SRV-EVT-${String(state.service.history.length + 1).padStart(3, '0')}`,
    action: type,
    title: action.title,
    detail: action.detail,
    at,
  });
  return state;
}
