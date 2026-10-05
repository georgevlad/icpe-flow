import { WorkflowError } from './workflow.mjs';

const baseScope = [
  'Analiza datelor primite și proiectarea soluției demonstrative',
  'Configurarea unui panou de monitorizare demonstrativ',
  'Punere în funcțiune simulată și o sesiune de instruire',
];
const assumptions = [
  'Lista finală de semnale se confirmă la deschiderea lucrării.',
  'Accesul la amplasament se stabilește împreună cu beneficiarul.',
];

export const OFFER_ACTIONS = {
  'offer-review': {
    stage: 'received',
    title: 'Solicitare analizată',
    detail: 'Persoana G identifică datele lipsă înainte de ofertare: lista preliminară de semnale și condițiile de acces la amplasament.',
    update(offer, at) {
      offer.stage = 'clarification';
      offer.reviewedAt = at;
    },
  },
  'offer-clarify': {
    stage: 'clarification',
    title: 'Clarificări primite',
    detail: 'Beneficiarul fictiv transmite lista preliminară de semnale și confirmă că o vizită poate fi planificată. Lista finală rămâne de confirmat la pornirea lucrării.',
    update(offer, at) {
      offer.stage = 'draft';
      offer.clarification = {
        at,
        received: 'Listă preliminară de semnale și disponibilitate pentru vizită.',
        openPoint: 'Lista finală de semnale se confirmă la deschiderea lucrării.',
      };
    },
  },
  'offer-draft': {
    stage: 'draft',
    title: 'Oferta rev. 01 pregătită',
    detail: 'DEMO-OF-001 rev. 01 reunește domeniul, ipotezele și o valoare exclusiv demonstrativă de 48.000 lei. Se așteaptă răspunsul beneficiarului.',
    update(offer, at) {
      offer.stage = 'feedback';
      offer.versions.push({ id: 'DEMO-OF-001', revision: '01', at, amountLei: 48_000, scope: [...baseScope], assumptions: [...assumptions] });
    },
  },
  'offer-feedback': {
    stage: 'feedback',
    title: 'Cerere de ajustare consemnată',
    detail: 'Beneficiarul fictiv solicită o a doua sesiune de instruire. Oferta rev. 01 rămâne în istoric și trebuie actualizată înainte de acceptare.',
    update(offer, at) {
      offer.stage = 'revision';
      offer.feedback = { at, request: 'Adăugarea unei a doua sesiuni de instruire.' };
    },
  },
  'offer-revise': {
    stage: 'revision',
    title: 'Oferta rev. 02 pregătită',
    detail: 'DEMO-OF-001 rev. 02 include a doua sesiune de instruire și o valoare exclusiv demonstrativă de 52.000 lei. Revizia 01 rămâne consultabilă.',
    update(offer, at) {
      offer.stage = 'acceptance';
      offer.versions.push({ id: 'DEMO-OF-001', revision: '02', at, amountLei: 52_000, scope: [...baseScope, 'A doua sesiune de instruire solicitată de beneficiar'], assumptions: [...assumptions] });
    },
  },
  'offer-accept': {
    stage: 'acceptance',
    title: 'Oferta rev. 02 acceptată în simulare',
    detail: 'Acceptarea fictivă fixează revizia 02 pentru transferul către echipa lucrării. Nu reprezintă semnătură sau acceptare contractuală reală.',
    update(offer, at) {
      offer.stage = 'handoff';
      offer.accepted = { revision: '02', at, by: 'Reprezentant beneficiar fictiv' };
    },
  },
  'offer-start': {
    stage: 'handoff',
    title: 'Fișă de pornire creată',
    detail: 'DEMO-L-004 este pornită demonstrativ. Persoana G primește solicitarea, clarificările, oferta rev. 02 acceptată și punctul rămas de confirmat.',
    update(offer, at) {
      offer.stage = 'started';
      offer.project = {
        id: 'DEMO-L-004', at, coordinator: 'Persoana G', acceptedOfferRevision: offer.accepted.revision,
        handoffItems: ['Solicitarea DEMO-SOL-001', 'Clarificările consemnate', 'DEMO-OF-001 rev. 02 acceptată'],
        openPoint: offer.clarification.openPoint,
      };
    },
  },
};

export function applyOfferAction(current, type, at) {
  if (!Object.hasOwn(OFFER_ACTIONS, type)) throw new WorkflowError('Acțiune necunoscută.', 400);
  const action = OFFER_ACTIONS[type];
  if (current.offer.stage !== action.stage) {
    throw new WorkflowError('Acțiunea nu este disponibilă în etapa curentă a ofertării.');
  }
  const state = structuredClone(current);
  action.update(state.offer, at);
  state.offer.history.push({
    id: `DEMO-OF-EVT-${String(state.offer.history.length + 1).padStart(3, '0')}`,
    action: type, title: action.title, detail: action.detail, at,
  });
  return state;
}
