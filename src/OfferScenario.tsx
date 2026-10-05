import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardList, Clock3, FileCheck2, FileText, History, Link2, LoaderCircle, MessageSquareText } from 'lucide-react';
import type { OfferAction, OfferCase, OfferStage } from './types';

const stages: OfferStage[] = ['received', 'clarification', 'draft', 'feedback', 'revision', 'acceptance', 'handoff', 'started'];
const stageLabels: Record<OfferStage, string> = {
  received: 'Solicitare primită', clarification: 'Clarificări necesare', draft: 'Ofertă de pregătit',
  feedback: 'Așteaptă răspuns', revision: 'De revizuit', acceptance: 'Așteaptă decizia',
  handoff: 'Transfer intern', started: 'Lucrare pornită',
};
const next: Record<Exclude<OfferStage, 'started'>, { action: OfferAction; eyebrow: string; title: string; description: string; button: string; details: string[] }> = {
  received: {
    action: 'offer-review', eyebrow: '01 / SOLICITARE', title: 'Ce știm înainte de ofertare?',
    description: 'Solicitarea fictivă descrie obiectivul, dar datele sunt preliminare. Identifică informațiile necesare pentru o ofertă cu ipoteze clare.',
    button: 'Analizează solicitarea', details: ['Client: Operator Apă Exemplu', 'Obiect: monitorizarea stației fictive Orizont', 'De clarificat: lista de semnale și accesul la amplasament'],
  },
  clarification: {
    action: 'offer-clarify', eyebrow: '02 / CLARIFICĂRI', title: 'Completăm datele de intrare.',
    description: 'Beneficiarul transmite o listă preliminară și disponibilitatea pentru o vizită. Lista finală rămâne un punct de confirmat la pornirea lucrării.',
    button: 'Consemnează clarificările', details: ['Listă preliminară de semnale primită', 'Vizită la amplasament posibilă', 'Lista finală rămâne de confirmat'],
  },
  draft: {
    action: 'offer-draft', eyebrow: '03 / OFERTĂ', title: 'Pregătim prima propunere.',
    description: 'Revizia 01 reunește domeniul, ipotezele și o valoare aleasă exclusiv pentru simulare. Poate fi comparată ulterior cu oferta actualizată.',
    button: 'Pregătește oferta rev. 01', details: ['Domeniu: analiză, monitorizare, punere în funcțiune simulată și instruire', 'Ipotezele rămân vizibile în ofertă', 'Valoare demonstrativă: 48.000 lei'],
  },
  feedback: {
    action: 'offer-feedback', eyebrow: '04 / RĂSPUNS CLIENT', title: 'Clientul cere o ajustare.',
    description: 'Beneficiarul fictiv solicită o a doua sesiune de instruire. Consemnează cererea înainte de a actualiza oferta.',
    button: 'Înregistrează cererea de ajustare', details: ['Solicitare: încă o sesiune de instruire', 'Oferta rev. 01 rămâne consultabilă', 'Revizia 02 va arăta diferența de domeniu și valoare'],
  },
  revision: {
    action: 'offer-revise', eyebrow: '05 / REVIZIE', title: 'Actualizăm oferta, păstrând prima versiune.',
    description: 'Revizia 02 include cererea suplimentară și o nouă valoare demonstrativă. Diferența față de revizia 01 devine explicită.',
    button: 'Pregătește oferta rev. 02', details: ['Se adaugă a doua sesiune de instruire', 'Valoare demonstrativă: 52.000 lei', 'Revizia 01 rămâne în istoric'],
  },
  acceptance: {
    action: 'offer-accept', eyebrow: '06 / DECIZIE', title: 'Fixăm versiunea acceptată.',
    description: 'Acceptarea fictivă a reviziei 02 stabilește ce informații vor fi transferate echipei lucrării. Acest pas nu este o semnătură contractuală.',
    button: 'Consemnează acceptarea rev. 02', details: ['Versiune propusă spre acceptare: DEMO-OF-001 rev. 02', 'Valoare: 52.000 lei, exclusiv demonstrativă', 'Punct deschis: lista finală de semnale'],
  },
  handoff: {
    action: 'offer-start', eyebrow: '07 / TRANSFER', title: 'Lucrarea pornește cu informațiile corecte.',
    description: 'Predă solicitarea, clarificările, oferta acceptată și punctul deschis către coordonatorul demonstrativ al noii lucrări.',
    button: 'Creează fișa de pornire', details: ['Coordonator: Persoana G', 'Ofertă acceptată: rev. 02', 'De confirmat la deschidere: lista finală de semnale'],
  },
};

function date(value: string) {
  return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
function money(value: number) { return `${new Intl.NumberFormat('ro-RO').format(value)} lei`; }

export default function OfferScenario({ offer, busy, onAction, onBack }: {
  offer: OfferCase;
  busy: boolean;
  onAction: (action: OfferAction) => Promise<boolean>;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<'work' | 'offers' | 'handoff' | 'history'>('work');
  const current = offer.stage === 'started' ? null : next[offer.stage];
  const currentIndex = stages.indexOf(offer.stage);
  const first = offer.versions.find(version => version.revision === '01');
  const second = offer.versions.find(version => version.revision === '02');
  return <div className="offer-page">
    <div className="dossier-heading"><div>
      <button className="back-link" onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button>
      <div className="dossier-code"><span className="mono">{offer.id}</span><span>/</span><span>SOLICITARE ȘI OFERTARE</span></div>
      <h1>Din solicitare în lucrare<span className="title-dot">.</span></h1>
      <p className="page-description">Clarificări, revizii de ofertă și informațiile predate echipei la pornire.</p>
    </div><span className={`service-status ${offer.stage === 'started' ? 'done' : ''}`}>{stageLabels[offer.stage]}</span></div>

    <div className="service-meta offer-meta">
      <div><small>CLIENT FICTIV</small><strong>Operator Apă Exemplu</strong></div>
      <div><small>OBIECT</small><strong>Stația fictivă Orizont</strong></div>
      <div><small>SOLICITARE</small><strong className="mono">DEMO-SOL-001</strong></div>
      <div><small>ULTIMA OFERTĂ</small><strong>{second ? 'DEMO-OF-001 · rev. 02' : first ? 'DEMO-OF-001 · rev. 01' : 'De pregătit'}</strong></div>
    </div>

    <div className="service-flow offer-flow" aria-label="Etapele solicitării și ofertării">
      {['Solicitare', 'Clarificări', 'Ofertă 01', 'Răspuns', 'Revizie 02', 'Acceptare', 'Transfer', 'Pornită'].map((label, index) => { const done = index < currentIndex || offer.stage === 'started'; return <div key={label} className={done ? 'done' : index === currentIndex ? 'current' : ''}>
        <span>{done ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><small>{label}</small>
      </div>; })}
    </div>

    <div className="tabs offer-tabs" role="tablist" aria-label="Secțiuni ofertare">
      <button role="tab" aria-selected={tab === 'work'} className={tab === 'work' ? 'active' : ''} onClick={() => setTab('work')}><ClipboardList size={16}/>Traseu</button>
      <button role="tab" aria-selected={tab === 'offers'} className={tab === 'offers' ? 'active' : ''} onClick={() => setTab('offers')}><FileText size={16}/>Oferte<span>{offer.versions.length}</span></button>
      <button role="tab" aria-selected={tab === 'handoff'} className={tab === 'handoff' ? 'active' : ''} onClick={() => setTab('handoff')}><FileCheck2 size={16}/>Pornire</button>
      <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}><History size={16}/>Istoric<span>{offer.history.length}</span></button>
    </div>

    {tab === 'work' && <div className="service-layout"><section className={`service-action ${offer.stage === 'started' ? 'complete' : ''}`}>
      <div className="service-action-top"><span className="eyebrow">{current?.eyebrow ?? '08 / LUCRARE PORNITĂ'}</span>{offer.stage === 'started' ? <CheckCircle2 size={24}/> : <ClipboardList size={24}/>}</div>
      <h2>{current?.title ?? 'Informațiile au ajuns la coordonator.'}</h2>
      <p>{current?.description ?? 'Fișa de pornire DEMO-L-004 păstrează oferta rev. 02 acceptată, clarificările și punctul încă deschis. Poți consulta oferta, transferul și istoricul.'}</p>
      {current ? <><div className="service-action-details"><strong>Ce se consemnează</strong><ul>{current.details.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div><button className="button primary" disabled={busy} onClick={() => void onAction(current.action)}>{busy ? <LoaderCircle className="spin" size={16}/> : <ArrowRight size={16}/>} {current.button}</button></> : <button className="button dark" onClick={() => setTab('handoff')}>Vezi fișa de pornire<ArrowRight size={16}/></button>}
    </section><aside className="service-side">
      <section className="service-card"><div className="section-heading"><h2>Solicitarea</h2><MessageSquareText size={18}/></div><span className="mono">DEMO-SOL-001</span><p>„Dorim o propunere pentru modernizarea monitorizării stației Orizont.”</p><div className="service-card-foot"><Link2 size={15}/>Date tehnice preliminare · caz fictiv</div></section>
      <section className="service-card"><div className="section-heading"><h2>Ultima activitate</h2><Clock3 size={17}/></div><strong>{offer.history.at(-1)?.title}</strong><p>{offer.history.at(-1)?.detail}</p><small>{date(offer.history.at(-1)!.at)}</small><button className="text-button" onClick={() => setTab('history')}>Vezi istoricul<ArrowRight size={14}/></button></section>
    </aside></div>}

    {tab === 'offers' && <section className="offer-documents"><div className="section-heading"><div><h2>Solicitarea și ofertele</h2><p className="small muted">Versiunile rămân vizibile pe măsură ce parcurgi scenariul.</p></div><span className="mono">DEMO-OF-001</span></div>
      <div className="document-notice">DOCUMENTE SIMULATE · Sumele nu sunt prețuri reale ale companiei.</div>
      <div className="offer-clarifications"><h3>Clarificări înainte de ofertare</h3><p><strong>Întrebat:</strong> lista preliminară de semnale și condițiile de acces la amplasament.</p><p><strong>Primit:</strong> {offer.clarification?.received ?? 'În așteptare'}</p><p><strong>Rămas de confirmat:</strong> {offer.clarification?.openPoint ?? 'Se stabilește după răspunsul beneficiarului.'}</p></div>
      <div className="offer-version-grid">{[first, second].map((version, index) => <article className="offer-version" key={index}>
        <div className="offer-version-top"><span className="mono">DEMO-OF-001 · REV. 0{index + 1}</span><strong>{version ? money(version.amountLei) : 'În așteptare'}</strong></div>
        {version ? <><p>{index === 0 ? 'Prima propunere' : 'Actualizată după cererea beneficiarului'} · {date(version.at)}</p><h3>Domeniu inclus</h3><ul>{version.scope.map(item => <li key={item}><Check size={14}/>{item}</li>)}</ul><h3>Ipoteze</h3><ul>{version.assumptions.map(item => <li key={item}><Link2 size={14}/>{item}</li>)}</ul>{index === 1 && <div className="offer-delta">+ a doua sesiune de instruire · + 4.000 lei demonstrativi față de rev. 01</div>}</> : <p className="offer-waiting">Această versiune va apărea după pasul corespunzător.</p>}
      </article>)}</div><p className="service-report-note">{offer.feedback ? `Cererea de ajustare: ${offer.feedback.request}` : 'Când beneficiarul cere o schimbare, revizia inițială rămâne consultabilă.'}</p>
    </section>}

    {tab === 'handoff' && <section className="service-report offer-handoff"><div className="section-heading"><div><h2>Fișă de pornire a lucrării</h2><p className="small muted">Transferă versiunile și punctele deschise către echipa lucrării.</p></div><span className="mono">DEMO-L-004</span></div>
      <div className="document-notice">FIȘĂ SIMULATĂ · Acceptarea și pornirea nu țin loc de contract sau aprobare reală.</div>
      <div className="service-report-grid">
        <div><small>Solicitare</small><strong>DEMO-SOL-001 · monitorizarea stației fictive Orizont</strong></div>
        <div><small>Clarificări</small><strong>{offer.clarification ? 'Consemnate' : 'În așteptare'}</strong></div>
        <div><small>Oferta acceptată</small><strong>{offer.accepted ? `DEMO-OF-001 rev. ${offer.accepted.revision} · ${money(second!.amountLei)}` : 'În așteptarea acceptării'}</strong></div>
        <div><small>Coordonator desemnat</small><strong>{offer.project?.coordinator ?? 'De desemnat la pornire'}</strong></div>
        <div><small>Lucrare</small><strong>{offer.project ? `${offer.project.id} · pornită în simulare la ${date(offer.project.at)}` : 'Nu a fost pornită'}</strong></div>
        <div><small>Punct de confirmat</small><strong>{offer.project?.openPoint ?? offer.clarification?.openPoint ?? 'De stabilit după clarificări'}</strong></div>
      </div>
      <div className="offer-handoff-list"><h3>Elemente predate echipei</h3><ul>{(offer.project?.handoffItems ?? ['Solicitarea DEMO-SOL-001', 'Clarificările', 'Oferta acceptată']).map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div>
      <p className="service-report-note">Acest scenariu se oprește la pornirea lucrării. Execuția propriu-zisă este ilustrată separat în dosarul Colibița.</p>
    </section>}

    {tab === 'history' && <section className="history-tab"><div className="section-heading"><div><h2>Istoricul solicitării</h2><p className="small muted">Deciziile și versiunile din acest scenariu fictiv.</p></div><span className="mono">{offer.history.length} înregistrări</span></div><div className="timeline">{[...offer.history].reverse().map((event, index) => <article key={event.id}><div className="timeline-date"><time>{date(event.at)}</time></div><span className={`timeline-point ${index === 0 ? 'latest' : ''}`}><Check size={12}/></span><div><span className="mono">{event.id}</span><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div></section>}
    <footer className="dossier-footer"><span>DEMO-SOL-001 · Exclusiv date fictive</span><button onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button></footer>
  </div>;
}
