import { ArrowRight, ChevronRight } from 'lucide-react';

export default function HelpSection({ onOpenDossier, dossierAvailable }: { onOpenDossier: () => void; dossierAvailable: boolean }) {
  return <div className="modal-content help-section">
    <p className="modal-intro">Găsește documentele și urmează pașii până la predare.</p>
    <div className="help-topics">
      <details open>
        <summary><ChevronRight size={16} aria-hidden="true"/>Cum folosesc dosarul?</summary>
        <div className="help-topic-content">
          <p>Deschide dosarul <strong>Colibița</strong>. Celelalte două lucrări sunt doar exemple.</p>
          <dl className="help-tabs">
            <div><dt>Spațiu de lucru</dt><dd>Vezi etapa curentă, sarcina și următoarea acțiune.</dd></div>
            <div><dt>Documente</dt><dd>Apasă pe un document ca să îl citești. „Compară cerințele” arată diferența dintre reviziile 01 și 02, adică versiunile documentului.</dd></div>
            <div><dt>Istoric</dt><dd>Vezi pașii înregistrați și ora fiecăruia.</dd></div>
          </dl>
        </div>
      </details>
      <details>
        <summary><ChevronRight size={16} aria-hidden="true"/>Care sunt pașii?</summary>
        <div className="help-topic-content">
          <ol>
            <li>Analizează și acceptă modificarea. Cerințele trec la revizia 02.</li>
            <li>Consemnează implementarea, apoi înregistrează testul.</li>
            <li>Consemnează remedierea, apoi confirmă retestarea. Abia atunci se închide observația.</li>
            <li>Apasă „Atașează” pentru fișa finală de test și instrucțiunile rev. 02.</li>
            <li>Apasă „Pregătește predarea”, apoi confirmă. Poți vedea procesul-verbal.</li>
          </ol>
        </div>
      </details>
      <details>
        <summary><ChevronRight size={16} aria-hidden="true"/>De ce nu pot preda?</summary>
        <div className="help-topic-content"><p>Predarea devine disponibilă după retestare și atașarea celor două documente finale. Verifică lista din „Pachet de predare”: elementele bifate sunt pregătite.</p></div>
      </details>
      <details>
        <summary><ChevronRight size={16} aria-hidden="true"/>Se păstrează progresul?</summary>
        <div className="help-topic-content"><p>Da, după reîncărcarea paginii. Toți vizitatorii folosesc același dosar. La publicarea unei versiuni noi pe server, demonstrația pornește de la început.</p></div>
      </details>
      <details>
        <summary><ChevronRight size={16} aria-hidden="true"/>Cum reîncep?</summary>
        <div className="help-topic-content"><p>În meniul din stânga, apasă „Resetează demonstrația”, apoi „Resetează acum”. Se șterg pașii făcuți în demonstrația curentă. Pe telefon, deschide mai întâi meniul de sus.</p></div>
      </details>
    </div>
    <p className="help-note">Datele, testele și documentele sunt fictive. Documentele se pot citi în aplicație; nu se pot încărca sau descărca fișiere.</p>
    <div className="modal-actions"><button className="button primary" disabled={!dossierAvailable} onClick={onOpenDossier}>Deschide dosarul Colibița<ArrowRight size={16}/></button></div>
  </div>;
}
