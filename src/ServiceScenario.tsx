import { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck, Clock3, FileText, History, Link2, LoaderCircle, Wrench } from 'lucide-react';
import type { ServiceAction, ServiceCase, ServiceStage } from './types';

const stages: ServiceStage[] = ['reported', 'classified', 'scheduled', 'verification', 'confirmation', 'closed'];
const stageLabels: Record<ServiceStage, string> = {
  reported: 'Sesizare primită', classified: 'Clasificată', scheduled: 'Programată',
  verification: 'De verificat', confirmation: 'Așteaptă confirmare', closed: 'Închisă',
};
const next: Record<Exclude<ServiceStage, 'closed'>, { action: ServiceAction; eyebrow: string; title: string; description: string; button: string; details: string[] }> = {
  reported: {
    action: 'service-classify', eyebrow: '01 / SESIZARE', title: 'Un semnal de la beneficiar.',
    description: 'Beneficiarul fictiv spune că interfața nu afișează ultima actualizare. Leagă sesizarea de echipamentul predat și atribuie un responsabil pentru verificare.',
    button: 'Clasifică și atribuie', details: ['Referință: DEMO-PV-002, predare anterioară fictivă', 'Echipament: DEMO-TA-002', 'Responsabil propus: Persoana E'],
  },
  classified: {
    action: 'service-schedule', eyebrow: '02 / PLANIFICARE', title: 'Stabilim următorul pas.',
    description: 'Persoana E are sesizarea și datele de identificare. Consemnează programarea demonstrativă a unei verificări împreună cu beneficiarul.',
    button: 'Programează verificarea', details: ['Responsabil: Persoana E', 'Vizită convenită în simulare', 'Cauza nu este încă stabilită'],
  },
  scheduled: {
    action: 'service-record-visit', eyebrow: '03 / INTERVENȚIE', title: 'Ce s-a găsit și ce s-a făcut?',
    description: 'Înregistrează observația, acțiunea și dovada fictivă. Intervenția singură nu închide sesizarea; rezultatul va fi verificat separat.',
    button: 'Consemnează intervenția', details: ['Constatare: afișarea actualizării datelor nu apare', 'Acțiune simulată: corecție în configurația demonstrativă', 'Dovadă: captură și notă simulate'],
  },
  verification: {
    action: 'service-verify', eyebrow: '04 / VERIFICARE', title: 'Rezultatul este verificat separat.',
    description: 'Persoana F verifică rezultatul consemnat de Persoana E. Raportul poate fi comunicat beneficiarului după această confirmare demonstrativă.',
    button: 'Confirmă verificarea', details: ['Verificator: Persoana F', 'Rezultat precompletat: afișarea se actualizează în simulare', 'Istoricul intervenției rămâne consultabil'],
  },
  confirmation: {
    action: 'service-close', eyebrow: '05 / CONFIRMARE', title: 'Închidem firul intervenției.',
    description: 'Consemnează primirea raportului de către beneficiarul fictiv și închide sesizarea. Confirmarea este doar un pas al demonstrației.',
    button: 'Consemnează confirmarea și închide', details: ['Raportul include constatarea, acțiunea și verificarea', 'Beneficiarul confirmă demonstrativ primirea raportului', 'Sesizarea rămâne urmărită în istoric'],
  },
};

function date(value: string) {
  return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function ServiceScenario({ service, busy, onAction, onBack }: {
  service: ServiceCase;
  busy: boolean;
  onAction: (action: ServiceAction) => Promise<boolean>;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<'case' | 'report' | 'history'>('case');
  const current = service.stage === 'closed' ? null : next[service.stage];
  const currentIndex = stages.indexOf(service.stage);
  return <div className="service-page">
    <div className="dossier-heading"><div>
      <button className="back-link" onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button>
      <div className="dossier-code"><span className="mono">{service.id}</span><span>/</span><span>INTERVENȚIE DUPĂ PREDARE</span></div>
      <h1>Sesizare după predare<span className="title-dot">.</span></h1>
      <p className="page-description">De la mesajul beneficiarului la raport, verificare și închiderea sesizării.</p>
    </div><span className={`service-status ${service.stage === 'closed' ? 'done' : ''}`}>{stageLabels[service.stage]}</span></div>

    <div className="service-meta">
      <div><small>BENEFICIAR FICTIV</small><strong>Operator Apă Exemplu</strong></div>
      <div><small>ECHIPAMENT</small><strong className="mono">DEMO-TA-002</strong></div>
      <div><small>PREDARE ANTERIOARĂ FICTIVĂ</small><strong className="mono">DEMO-PV-002</strong></div>
      <div><small>RESPONSABIL</small><strong>{service.assignee ?? 'De atribuit'}</strong></div>
    </div>

    <div className="service-flow" aria-label="Etapele intervenției">
      {['Sesizare', 'Planificare', 'Intervenție', 'Verificare', 'Confirmare', 'Închisă'].map((label, index) => { const done = index < currentIndex || service.stage === 'closed'; return <div key={label} className={done ? 'done' : index === currentIndex ? 'current' : ''}>
        <span>{done ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><small>{label}</small>
      </div>; })}
    </div>

    <div className="tabs service-tabs" role="tablist" aria-label="Secțiuni intervenție">
      <button role="tab" aria-selected={tab === 'case'} className={tab === 'case' ? 'active' : ''} onClick={() => setTab('case')}><Wrench size={16}/>Cazul</button>
      <button role="tab" aria-selected={tab === 'report'} className={tab === 'report' ? 'active' : ''} onClick={() => setTab('report')}><FileText size={16}/>Raport</button>
      <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}><History size={16}/>Istoric<span>{service.history.length}</span></button>
    </div>

    {tab === 'case' && <div className="service-layout">
      <section className={`service-action ${service.stage === 'closed' ? 'complete' : ''}`}>
        <div className="service-action-top"><span className="eyebrow">{current?.eyebrow ?? '06 / CAZ ÎNCHIS'}</span>{service.stage === 'closed' ? <CheckCircle2 size={24}/> : <ClipboardCheck size={24}/>}</div>
        <h2>{current?.title ?? 'Sesizarea are un rezultat documentat.'}</h2>
        <p>{current?.description ?? 'Raportul, verificarea și confirmarea demonstrativă sunt păstrate împreună cu sesizarea. Poți consulta raportul și istoricul.'}</p>
        {current ? <>
          <div className="service-action-details"><strong>Ce se consemnează</strong><ul>{current.details.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div>
          <button className="button primary" disabled={busy} onClick={() => void onAction(current.action)}>{busy ? <LoaderCircle className="spin" size={16}/> : <ArrowRight size={16}/>} {current.button}</button>
        </> : <button className="button dark" onClick={() => setTab('report')}>Vezi raportul final<ArrowRight size={16}/></button>}
      </section>
      <aside className="service-side">
        <section className="service-card"><div className="section-heading"><h2>Sesizarea primită</h2><AlertCircle size={18}/></div><span className="mono">DEMO-SRV-001</span><p>„Interfața nu afișează ultima actualizare pentru echipamentul demonstrativ.”</p><div className="service-card-foot"><Link2 size={15}/>Legată de predarea DEMO-PV-002</div></section>
        <section className="service-card"><div className="section-heading"><h2>Ultima activitate</h2><Clock3 size={17}/></div><strong>{service.history.at(-1)?.title}</strong><p>{service.history.at(-1)?.detail}</p><small>{date(service.history.at(-1)!.at)}</small><button className="text-button" onClick={() => setTab('history')}>Vezi istoricul<ArrowRight size={14}/></button></section>
      </aside>
    </div>}

    {tab === 'report' && <section className="service-report">
      <div className="section-heading"><div><h2>Raport demonstrativ de intervenție</h2><p className="small muted">Se completează pe măsură ce parcurgi pașii scenariului.</p></div><span className="mono">DEMO-RI-001</span></div>
      <div className="document-notice">DOCUMENT SIMULAT · Nu certifică o intervenție sau o verificare tehnică reală.</div>
      <div className="service-report-grid">
        <div><small>Sesizare</small><strong>Actualizarea datelor nu apare în interfață</strong></div>
        <div><small>Referință predare</small><strong>DEMO-PV-002 · fictivă</strong></div>
        <div><small>Responsabil</small><strong>{service.assignee ?? 'De atribuit'}</strong></div>
        <div><small>Programare</small><strong>{service.scheduledAt ? `Consemnată la ${date(service.scheduledAt)}` : 'În așteptare'}</strong></div>
        <div><small>Constatare</small><strong>{service.intervention?.finding ?? 'În așteptarea intervenției'}</strong></div>
        <div><small>Acțiune și dovadă</small><strong>{service.intervention ? `${service.intervention.action} ${service.intervention.evidence}` : 'În așteptarea intervenției'}</strong></div>
        <div><small>Verificare separată</small><strong>{service.verification ? `${service.verification.by}: ${service.verification.result}` : 'În așteptare'}</strong></div>
        <div><small>Confirmarea beneficiarului</small><strong>{service.clientConfirmation?.note ?? 'În așteptare'}</strong></div>
      </div>
      <p className="service-report-note">Persoanele, acțiunile, constatarea și confirmarea sunt fictive. Raportul arată legătura dintre pași, fără a înlocui documentele sau aprobările reale ale firmei.</p>
    </section>}

    {tab === 'history' && <section className="history-tab"><div className="section-heading"><div><h2>Istoricul intervenției</h2><p className="small muted">Sesizarea inițială și acțiunile parcurse în demonstrație.</p></div><span className="mono">{service.history.length} înregistrări</span></div><div className="timeline">{[...service.history].reverse().map((event, index) => <article key={event.id}><div className="timeline-date"><time>{date(event.at)}</time></div><span className={`timeline-point ${index === 0 ? 'latest' : ''}`}><Check size={12}/></span><div><span className="mono">{event.id}</span><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div></section>}
    <footer className="dossier-footer"><span>DEMO-SRV-001 · Exclusiv date fictive</span><button onClick={onBack}><ArrowLeft size={14}/>Toate scenariile</button></footer>
  </div>;
}
