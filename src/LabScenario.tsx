import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardList, Clock3, FileText, FlaskConical, History, Link2, LoaderCircle, TestTube2 } from 'lucide-react';
import type { LabAction, LabCase, LabStage } from './types';

const stages: LabStage[] = ['requested', 'planned', 'collected', 'received', 'review', 'ready', 'issued'];
const stageLabels: Record<LabStage, string> = {
  requested: 'Cerere primită', planned: 'Recoltare planificată', collected: 'Probă recoltată',
  received: 'Probă primită', review: 'Rezultate de verificat', ready: 'Raport de emis', issued: 'Raport emis',
};
const next: Record<Exclude<LabStage, 'issued'>, { action: LabAction; eyebrow: string; title: string; description: string; button: string; details: string[] }> = {
  requested: {
    action: 'lab-plan', eyebrow: '01 / CERERE', title: 'De la cerere la probă.',
    description: 'Beneficiarul fictiv cere valori pentru doi indicatori. Leagă solicitarea de un punct de recoltare demonstrativ și desemnează persoana care va preleva proba.',
    button: 'Planifică recoltarea', details: ['Cerere: DEMO-LAB-001', 'Punct fictiv: stația Nord', 'Indicatori solicitați: pH și conductivitate'],
  },
  planned: {
    action: 'lab-collect', eyebrow: '02 / RECOLTARE', title: 'Proba primește un identificator.',
    description: 'Consemnează prelevarea fictivă. Codul probei și momentul recoltării vor apărea apoi în toate înregistrările și în raport.',
    button: 'Consemnează recoltarea', details: ['Cod probă: DEMO-PROBA-001', 'Prelevare simulată: Persoana H', 'Sursă: punct fictiv al stației Nord'],
  },
  collected: {
    action: 'lab-receive', eyebrow: '03 / PRIMIRE', title: 'Urmărim proba la intrarea în laborator.',
    description: 'Consemnează primirea și verificarea demonstrativă a identificatorului probei. Analiza va deveni disponibilă numai după acest pas.',
    button: 'Înregistrează primirea', details: ['Probă: DEMO-PROBA-001', 'Primire simulată: Persoana I', 'Identificatorul și starea sunt consemnate'],
  },
  received: {
    action: 'lab-analyze', eyebrow: '04 / ANALIZĂ', title: 'Înregistrăm două rezultate fictive.',
    description: 'Valorile sunt inventate pentru a arăta cum se leagă rezultatul de proba primită. Nu reprezintă măsurători și nu indică o concluzie de conformitate.',
    button: 'Înregistrează rezultatele', details: ['pH: 7,2', 'Conductivitate: 540 µS/cm', 'Analist demonstrativ: Persoana I'],
  },
  review: {
    action: 'lab-review', eyebrow: '05 / VERIFICARE', title: 'O a doua persoană urmărește înregistrările.',
    description: 'Persoana J verifică demonstrativ legătura dintre cerere, probă și rezultate înainte de emiterea raportului.',
    button: 'Consemnează verificarea', details: ['Cererea și proba au același traseu', 'Rezultatele rămân asociate probei DEMO-PROBA-001', 'Verificator demonstrativ: Persoana J'],
  },
  ready: {
    action: 'lab-issue', eyebrow: '06 / RAPORT', title: 'Pregătim raportul demonstrativ.',
    description: 'Raportul păstrează un extras al valorilor, identificatorul probei și verificarea separată. Emiterea este doar un pas al simulării.',
    button: 'Emite raportul demonstrativ', details: ['Raport: DEMO-RAP-LAB-001 rev. 01', 'Destinatar fictiv: Operator Apă Exemplu', 'Fără verdict de conformitate sau transmitere externă'],
  },
};

function date(value: string) {
  return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function LabScenario({ lab, busy, onAction, onBack }: {
  lab: LabCase;
  busy: boolean;
  onAction: (action: LabAction) => Promise<boolean>;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<'work' | 'sample' | 'report' | 'history'>('work');
  const current = lab.stage === 'issued' ? null : next[lab.stage];
  const currentIndex = stages.indexOf(lab.stage);
  return <div className="lab-page">
    <div className="dossier-heading"><div>
      <button className="back-link" onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button>
      <div className="dossier-code"><span className="mono">{lab.id}</span><span>/</span><span>PROBĂ ȘI RAPORT DE LABORATOR</span></div>
      <h1>De la probă la raport<span className="title-dot">.</span></h1>
      <p className="page-description">Identificarea probei, rezultatele fictive și înregistrările care ajung în raport.</p>
    </div><span className={`service-status ${lab.stage === 'issued' ? 'done' : ''}`}>{stageLabels[lab.stage]}</span></div>

    <div className="service-meta lab-meta">
      <div><small>CLIENT FICTIV</small><strong>Operator Apă Exemplu</strong></div>
      <div><small>CERERE</small><strong className="mono">DEMO-LAB-001</strong></div>
      <div><small>PROBĂ</small><strong className="mono">{lab.sample?.id ?? 'De recoltat'}</strong></div>
      <div><small>RAPORT</small><strong className="mono">{lab.report ? `${lab.report.id} · rev. ${lab.report.revision}` : 'Neemis'}</strong></div>
    </div>

    <div className="service-flow lab-flow" aria-label="Etapele probei și raportului">
      {['Cerere', 'Recoltare', 'Primire', 'Analiză', 'Verificare', 'Raport', 'Emis'].map((label, index) => { const done = index < currentIndex || lab.stage === 'issued'; return <div key={label} className={done ? 'done' : index === currentIndex ? 'current' : ''}>
        <span>{done ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><small>{label}</small>
      </div>; })}
    </div>

    <div className="tabs lab-tabs" role="tablist" aria-label="Secțiuni laborator">
      <button role="tab" aria-selected={tab === 'work'} className={tab === 'work' ? 'active' : ''} onClick={() => setTab('work')}><FlaskConical size={16}/>Flux</button>
      <button role="tab" aria-selected={tab === 'sample'} className={tab === 'sample' ? 'active' : ''} onClick={() => setTab('sample')}><TestTube2 size={16}/>Probă și analiză</button>
      <button role="tab" aria-selected={tab === 'report'} className={tab === 'report' ? 'active' : ''} onClick={() => setTab('report')}><FileText size={16}/>Raport</button>
      <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}><History size={16}/>Istoric<span>{lab.history.length}</span></button>
    </div>

    {tab === 'work' && <div className="service-layout"><section className={`service-action ${lab.stage === 'issued' ? 'complete' : ''}`}>
      <div className="service-action-top"><span className="eyebrow">{current?.eyebrow ?? '07 / RAPORT EMIS'}</span>{lab.stage === 'issued' ? <CheckCircle2 size={24}/> : <ClipboardList size={24}/>}</div>
      <h2>{current?.title ?? 'Raportul păstrează traseul probei.'}</h2>
      <p>{current?.description ?? 'DEMO-RAP-LAB-001 rev. 01 a fost emis în simulare. Poți consulta proba, rezultatele precompletate, raportul și istoricul fără a modifica înregistrările.'}</p>
      {current ? <><div className="service-action-details"><strong>Ce se consemnează</strong><ul>{current.details.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div><button className="button primary" disabled={busy} onClick={() => void onAction(current.action)}>{busy ? <LoaderCircle className="spin" size={16}/> : <ArrowRight size={16}/>} {current.button}</button></> : <button className="button dark" onClick={() => setTab('report')}>Vezi raportul<ArrowRight size={16}/></button>}
    </section><aside className="service-side">
      <section className="service-card"><div className="section-heading"><h2>Cererea de analiză</h2><TestTube2 size={18}/></div><span className="mono">DEMO-LAB-001</span><p>Valori solicitate pentru pH și conductivitate la un punct fictiv al stației Nord.</p><div className="service-card-foot"><Link2 size={15}/>O singură probă demonstrativă</div></section>
      <section className="service-card"><div className="section-heading"><h2>Ultima activitate</h2><Clock3 size={17}/></div><strong>{lab.history.at(-1)?.title}</strong><p>{lab.history.at(-1)?.detail}</p><small>{date(lab.history.at(-1)!.at)}</small><button className="text-button" onClick={() => setTab('history')}>Vezi istoricul<ArrowRight size={14}/></button></section>
    </aside></div>}

    {tab === 'sample' && <section className="service-report lab-document"><div className="section-heading"><div><h2>Fișa probei și analiza</h2><p className="small muted">Aceleași identificatoare leagă cererea, prelevarea, primirea și valorile.</p></div><span className="mono">DEMO-PROBA-001</span></div>
      <div className="document-notice">ÎNREGISTRĂRI SIMULATE · Nu reprezintă recoltare sau analiză efectuată.</div>
      <div className="service-report-grid">
        <div><small>Cerere</small><strong>DEMO-LAB-001 · pH și conductivitate</strong></div>
        <div><small>Planificare</small><strong>{lab.plannedAt ? `Consemnată la ${date(lab.plannedAt)}` : 'În așteptare'}</strong></div>
        <div><small>Probă și sursă</small><strong>{lab.sample ? `${lab.sample.id} · ${lab.sample.source}` : 'Proba nu a fost recoltată'}</strong></div>
        <div><small>Recoltare</small><strong>{lab.sample ? `${lab.sample.collectedBy} · ${date(lab.sample.at)}` : 'În așteptare'}</strong></div>
        <div><small>Primire în laborator</small><strong>{lab.receipt ? `${lab.receipt.receivedBy} · ${date(lab.receipt.at)}` : 'În așteptare'}</strong></div>
        <div><small>Verificare separată</small><strong>{lab.review ? `${lab.review.reviewedBy} · ${date(lab.review.at)}` : 'În așteptare'}</strong></div>
      </div>
      <h3 className="lab-result-heading">Rezultate demonstrative</h3>
      {lab.analysis ? <div className="table-scroll"><table><thead><tr><th>Indicator</th><th>Valoare fictivă</th><th>Unitate</th></tr></thead><tbody>{lab.analysis.results.map(row => <tr key={row.indicator}><td>{row.indicator}</td><td>{row.value}</td><td>{row.unit}</td></tr>)}</tbody></table></div> : <p className="lab-pending">Valorile vor apărea după pasul „Înregistrează rezultatele”.</p>}
      <p className="service-report-note">Valorile sunt inventate și nu sunt comparate cu limite sau standarde. Verificarea din scenariu privește numai traseul înregistrărilor.</p>
    </section>}

    {tab === 'report' && <section className="service-report lab-document"><div className="section-heading"><div><h2>Raport demonstrativ de laborator</h2><p className="small muted">{lab.report ? 'Emis în simulare' : 'Proiect · ne-emis'}</p></div><span className="mono">DEMO-RAP-LAB-001 · rev. 01</span></div>
      <div className="document-notice">DOCUMENT SIMULAT · Nu este buletin de analiză, nu atestă conformitate și nu are valoare de acreditare.</div>
      <div className="service-report-grid">
        <div><small>Destinatar</small><strong>Operator Apă Exemplu</strong></div>
        <div><small>Probă</small><strong>{lab.report?.sampleId ?? lab.sample?.id ?? 'În așteptare'}</strong></div>
        <div><small>Originea probei</small><strong>{lab.sample?.source ?? 'În așteptare'}</strong></div>
        <div><small>Data emiterii</small><strong>{lab.report ? date(lab.report.at) : 'Neemis'}</strong></div>
        <div><small>Analist demonstrativ</small><strong>{lab.analysis?.analyst ?? 'În așteptare'}</strong></div>
        <div><small>Verificator demonstrativ</small><strong>{lab.review?.reviewedBy ?? 'În așteptare'}</strong></div>
      </div>
      <h3 className="lab-result-heading">Valori incluse în raport</h3>
      {lab.report ? <div className="table-scroll"><table><thead><tr><th>Indicator</th><th>Valoare fictivă</th><th>Unitate</th></tr></thead><tbody>{lab.report.results.map(row => <tr key={row.indicator}><td>{row.indicator}</td><td>{row.value}</td><td>{row.unit}</td></tr>)}</tbody></table></div> : <p className="lab-pending">Raportul va păstra valorile numai după verificarea separată și emiterea demonstrativă.</p>}
      <p className="service-report-note">Nu există interpretare, verdict de conformitate, semnătură, fișier descărcabil sau transmitere către beneficiar.</p>
    </section>}

    {tab === 'history' && <section className="history-tab"><div className="section-heading"><div><h2>Istoricul probei</h2><p className="small muted">Cererea inițială și pașii parcurși în demonstrație.</p></div><span className="mono">{lab.history.length} înregistrări</span></div><div className="timeline">{[...lab.history].reverse().map((event, index) => <article key={event.id}><div className="timeline-date"><time>{date(event.at)}</time></div><span className={`timeline-point ${index === 0 ? 'latest' : ''}`}><Check size={12}/></span><div><span className="mono">{event.id}</span><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div></section>}
    <footer className="dossier-footer"><span>DEMO-LAB-001 · Exclusiv date fictive</span><button onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button></footer>
  </div>;
}
