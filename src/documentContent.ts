import type { DemoState, DocumentData } from './types';

const stages: DemoState['stage'][] = ['change', 'implementation', 'testing', 'remediation', 'retesting', 'preparation', 'delivered'];
const disclaimer = 'Document fictiv pentru discuție. Nu descrie procedurile interne ICPE Bistrița și nu constituie documentație pentru execuție, conformitate sau exploatare.';

export function getDocuments(state: DemoState): DocumentData[] {
  const step = stages.indexOf(state.stage);
  const accepted = step >= 1;
  const implemented = step >= 2;
  const tested = step >= 3;
  const remedied = step >= 4;
  const retested = step >= 5;
  const delivered = step >= 6;
  const revision = String(state.revision).padStart(2, '0');
  const manualRevision = implemented ? '02' : '01';
  const observationState = !state.observation ? 'Nicio observație consemnată încă' : state.observation.status === 'open' ? 'Deschisă — remediere necesară' : state.observation.status === 'awaiting-retest' ? 'Remediată — așteaptă retestarea' : 'Închisă după retestare';
  const packageReady = retested && state.attachments.test && state.attachments.manualRevision === 2;
  const testState = retested ? 'Completată după retestare' : tested ? 'Test inițial consemnat' : 'Proiect — test neefectuat';
  const changeState = implemented ? 'Închisă după implementare' : accepted ? 'Acceptată pentru implementare' : 'În așteptarea deciziei';
  const borderRows: string[][] = [
    ['DEMO-F01', 'Fișă de deschidere', '01', 'Acceptată pentru proiectare', 'Coordonator'],
    ['DEMO-CER-001', 'Cerințe de afișare', revision, accepted ? 'Acceptată în simulare' : 'Referință inițială', 'Proiectant'],
    ['DEMO-LS-001', 'Lista semnalelor', revision, accepted ? 'Acceptată în simulare' : 'Referință inițială', 'Proiectant'],
    ['DEMO-MOD-001', 'Decizie modificare', '01', changeState, 'Coordonator'],
    ['DEMO-TEST-001', 'Fișă de test', revision, testState, 'Verificator teste'],
    ['DEMO-MAN-001', 'Instrucțiuni operator', manualRevision, implemented ? (state.attachments.manualRevision === 2 ? 'Rev. 02 în pachet' : 'Rev. 02 disponibilă; neatașată la pachet') : 'Revizie inițială', 'Autor desemnat'],
  ];

  return [
    {
      id: 'opening', code: 'DEMO-F01', title: 'Fișă de deschidere a lucrării', revision: '01', status: 'Acceptată pentru proiectare',
      lead: 'Modernizarea automatizării stației de tratare „Colibița”. Fișa stabilește domeniul limitat al demonstrației și documentele de intrare.',
      sections: [
        { title: 'Identificarea lucrării', headers: ['Câmp', 'Valoare demonstrativă'], rows: [
          ['Lucrare / echipament', 'DEMO-L-001 / DEMO-TA-001'],
          ['Beneficiar', 'Operator Apă Exemplu — organizație fictivă'],
          ['Obiect', 'Tablou și interfață operator pentru stația Colibița'],
          ['Coordonator', 'Persoana A — rol demonstrativ'],
          ['Responsabil proiectare', 'Persoana B — rol demonstrativ'],
          ['Date primite', 'Lista semnalelor demonstrative și cerințele de afișare'],
          ['Date de clarificat la deschidere', 'Denumirile acceptate de beneficiar pentru stările afișate'],
          ['Documente asociate', 'DEMO-CER-001; DEMO-LS-001'],
        ] },
        { title: 'Domeniul lucrării simulate', body: 'Exemplul urmărește exclusiv două denumiri afișate pentru P-01 și trasabilitatea schimbării lor. Nu definește circuite, protecții, parametri, comenzi sau logică de siguranță. Deschiderea și proiectarea sunt deja parcurse la începutul demonstrației.' },
        { title: 'Clarificarea urmărită', body: accepted ? 'Denumirile „Funcționare” și „Indisponibil” au fost acceptate în simulare prin DEMO-MOD-001. Fișa de deschidere rămâne la revizia 01, ca document de origine.' : 'Solicitarea beneficiarului este înregistrată în DEMO-MOD-001 și așteaptă decizia demonstrativă. Cerințele rev. 01 sunt încă referința inițială.' },
        { title: 'Notă de utilizare', body: disclaimer },
      ],
    },
    {
      id: 'change', code: 'DEMO-MOD-001', title: 'Cerere și decizie de modificare', revision: '01', status: changeState,
      lead: 'Beneficiarul fictiv solicită afișarea distinctă a stărilor „Funcționare” și „Indisponibil” pentru echipamentul demonstrativ P-01.',
      sections: [
        { title: 'Solicitarea', headers: ['Câmp', 'Detaliu'], rows: [
          ['Data fictivă a cererii', '05.10.2026'],
          ['Solicitant', 'Rol demonstrativ reprezentant beneficiar'],
          ['Motiv declarat', 'Uniformizarea denumirilor folosite de operatori'],
          ['Responsabil implementare', 'Persoana C — rol demonstrativ'],
          ['Termen fictiv', '08.10.2026'],
        ] },
        { title: 'Impactul identificat', headers: ['Document / element', 'Înainte', 'După acceptare'], rows: [
          ['DEMO-CER-001 — cerințe de afișare', 'Rev. 01', 'Rev. 02'],
          ['DEMO-LS-001 — lista semnalelor', 'Rev. 01', 'Rev. 02'],
          ['DEMO-TEST-001 — lista verificărilor', 'Rev. 01', 'Rev. 02'],
          ['Interfață operator P-01', 'Etichetă anterioară', 'Funcționare / Indisponibil'],
        ] },
        { title: 'Evaluare demonstrativă', body: 'Proiectantul identifică documentele și elementele software afectate. Evaluarea tehnică este o premisă fictivă a demonstrației; într-o lucrare reală ar reveni specialiștilor desemnați. Aplicația consemnează o decizie, fără a o valida tehnic.' },
        { title: 'Decizia', body: accepted ? 'Acceptată în simulare pentru implementare. Reprezentantul demonstrativ al beneficiarului acceptă denumirile. Revizia 02 este referința curentă pentru cerințe, lista semnalelor și fișa de test.' : 'Decizie neconsemnată. Textul propus este „Acceptată în simulare pentru implementare”. Reviziile 02 și sarcina de implementare apar numai după acțiunea de acceptare.' },
        { title: 'Urmărirea implementării', body: implemented ? 'Persoana C a consemnat implementarea demonstrativă folosind DEMO-CER-001 și DEMO-LS-001 rev. 02. Decizia de modificare este închisă după implementare; verificarea prin test are înregistrare separată.' : accepted ? 'Sarcină deschisă pentru Persoana C: actualizarea denumirilor conform documentelor rev. 02 și pregătirea instrucțiunilor operatorului. Implementarea nu este încă consemnată.' : 'Sarcina de implementare nu este încă activă. Se așteaptă acceptarea modificării.' },
        { title: 'Confirmare demonstrativă', body: 'Acceptarea din aplicație nu substituie semnătura ori acceptarea contractuală. Modul, autoritatea și dovezile unei confirmări reale trebuie stabilite cu firma.' },
      ],
    },
    {
      id: 'register', code: 'DEMO-B01', title: 'Borderou de documente și revizii', revision: '01', status: delivered ? 'Revizii păstrate în pachetul predat' : accepted ? 'Actualizat după modificare' : 'Referințe inițiale',
      lead: 'Borderou generat din starea dosarului. Arată reviziile documentelor disponibile; includerea în pachet este verificată separat prin DEMO-PRED-001.',
      sections: [
        { title: 'Documentele dosarului', headers: ['Cod', 'Document', 'Rev.', 'Stare curentă', 'Responsabil'], rows: borderRows },
        { title: 'Controlul reviziilor', body: accepted ? 'Cerințele și lista semnalelor rev. 01 sunt înlocuite în demonstrație de rev. 02. Comparația cerințelor păstrează vizibilă schimbarea. Fișa de test rev. 02 consemnează separat rezultatul inițial și retestarea, fără a șterge observația inițială.' : 'Revizia 01 este referința inițială. Revizia 02 este propusă prin cererea de modificare și nu este încă valabilă în demonstrație.' },
        { title: 'Disponibil în dosar versus atașat la pachet', body: implemented ? `Instrucțiunile operatorului rev. 02 sunt disponibile pentru verificarea documentară. Pachetul de predare conține în acest moment rev. ${String(state.attachments.manualRevision).padStart(2, '0')}. Fișa de test ${state.attachments.test ? 'este atașată pachetului' : 'nu este încă atașată pachetului'}.` : 'Pachetul pornește cu instrucțiunile operatorului rev. 01. Revizia finală și fișa de test vor necesita acțiuni explicite de includere înainte de predare.' },
        ...(delivered && state.deliveredPackage ? [{ title: 'Reviziile transmise', headers: ['Cod document', 'Revizia din pachet'], rows: state.deliveredPackage.documents.map(document => [document.code, document.revision]) }] : []),
        { title: 'De validat într-o lucrare reală', body: 'Cine publică o revizie, dacă editarea mai este permisă după acceptare și cum se gestionează fișierele CAD sau codul sursă în sistemele lor specializate. Borderoul demonstrativ nu definește aceste proceduri.' },
      ],
    },
    {
      id: 'test', code: 'DEMO-TEST-001', title: 'Fișă demonstrativă de test și observație', revision, status: testState,
      lead: 'Echipament DEMO-TA-001. Exemplu de trasabilitate documentară; nu reprezintă un plan complet de testare și nu dovedește siguranță, conformitate sau performanță.',
      sections: [
        { title: 'Verificări demonstrative', headers: ['Verificare', 'Referință', 'Rezultat inițial', 'Acțiune'], rows: [
          ['Denumirile afișate corespund cerințelor acceptate', `DEMO-CER-001 rev. ${revision}`, tested ? 'O etichetă diferă' : 'Neconsemnat — test neefectuat', tested ? 'Deschisă DEMO-OBS-001' : 'Se stabilește după test'],
          ['Documentația operatorului folosește aceleași denumiri', `DEMO-MAN-001 rev. ${accepted ? '02' : '01'}`, tested ? 'Corespunde' : 'Neconsemnat — test neefectuat', tested ? 'Nicio acțiune în exemplu' : 'Se stabilește după test'],
        ] },
        { title: 'Observație DEMO-OBS-001', body: tested ? `${remedied ? 'La testul inițial, pentru starea „Indisponibil”, interfața afișa' : 'Pentru starea „Indisponibil”, interfața afișează încă'} denumirea anterioară „Oprit”. Responsabil remediere: Persoana C. Stare: ${observationState}. „Oprit” este completarea fictivă folosită pentru comparația din PoC.` : 'Observația nu a fost încă deschisă. Fișa este un proiect de verificare; rezultatele nu sunt consemnate înaintea acțiunii de test.' },
        { title: 'Remediere și dovadă', body: remedied ? 'Persoana C a consemnat actualizarea etichetei la „Indisponibil”. Dovadă simulată: captură demonstrativă a interfeței după actualizare, disponibilă în panoul de test. Dovada nu reprezintă o captură dintr-o instalație reală. Remedierea singură nu închide observația.' : tested ? 'Remedierea și dovada nu sunt încă înregistrate. Observația rămâne deschisă.' : 'Această secțiune va fi completată numai dacă testul consemnează o observație și se înregistrează remedierea.' },
        { title: 'Retestare', body: retested ? 'Persoana D a confirmat în simulare corespondența etichetei cu DEMO-CER-001 rev. 02. Rezultat retestare: corespunde. DEMO-OBS-001 este închisă după această verificare. Rezultatul inițial „O etichetă diferă” rămâne în fișă pentru trasabilitate.' : remedied ? 'Retestare neefectuată. Observația așteaptă confirmarea distinctă a Persoanei D și rămâne neînchisă.' : 'Retestarea se consemnează separat, după remediere. Nu există încă un rezultat de retestare.' },
        { title: 'Legătura cu predarea', body: state.attachments.test ? 'Fișa completată după retestare este atașată explicit pachetului de predare.' : retested ? 'Fișa este completată și disponibilă, dar încă nu este atașată pachetului. Folosește acțiunea de completare a pachetului.' : 'Fișa va putea fi inclusă în pachet după remediere și retestare.' },
      ],
    },
    {
      id: 'handover-list', code: 'DEMO-PRED-001', title: 'Listă de predare', revision: '01', status: delivered ? 'Pachet predat în simulare' : packageReady ? 'Complet pentru predarea demonstrativă' : 'Incomplet',
      lead: 'Lista urmărește documentele și verificările convenite pentru acest exemplu. Existența unui document în dosar nu îl adaugă automat în pachetul transmis.',
      sections: [
        { title: 'Verificarea pachetului', headers: ['Element demonstrativ', 'Situație curentă', 'Condiția de îndeplinit'], rows: [
          ['Borderou cu reviziile documentelor', 'Prezent — DEMO-B01', 'Borderou disponibil'],
          ['Documentația stabilită pentru exemplu', implemented ? 'Îndeplinit — cerințe și listă semnale rev. 02 acceptate și implementate' : `Neîndeplinit — ${accepted ? 'rev. 02 acceptată; implementare neconsemnată' : 'rev. 01 disponibilă; modificare neacceptată'}`, 'Revizia 02 acceptată și implementată'],
          ['Fișă de test după remediere', state.attachments.test ? 'Atașată — DEMO-TEST-001 rev. 02' : 'Lipsă din pachet', 'Retestare consemnată și fișă atașată explicit'],
          ['Instrucțiuni operator, revizia finală', state.attachments.manualRevision === 2 ? 'Rev. 02 atașată' : 'Rev. 01 — revizie anterioară', 'DEMO-MAN-001 rev. 02 atașată explicit'],
          ['Observație DEMO-OBS-001', observationState, 'Închisă după remediere și retestare'],
        ] },
        { title: 'Condițiile din demonstrație', body: packageReady ? 'Modificarea a fost implementată, observația a fost închisă prin retestare, iar fișa de test și instrucțiunile finale sunt incluse. Pachetul este complet pentru acțiunea demonstrativă de predare.' : 'Predarea rămâne indisponibilă până la implementare, test, remediere, retestare și adăugarea explicită a fișei de test și a instrucțiunilor rev. 02. Aceste reguli sunt propuse numai pentru scenariul fictiv.' },
        { title: 'Decizia reală de predare', body: 'Lista reală ar porni de la contract și de la procedurile firmei. Aplicația poate semnala lipsuri, dar decizia de predare ar aparține persoanei autorizate. Starea „complet” din PoC nu certifică recepția tehnică sau conformitatea.' },
      ],
    },
    {
      id: 'handover-record', code: 'DEMO-PV-001', title: 'Proces-verbal de predare documentară', revision: '01', status: delivered ? 'Predat în simulare' : 'Proiect — predare neconsemnată',
      lead: delivered ? 'Pachetul documentar al lucrării DEMO-L-001, echipament DEMO-TA-001, a fost predat în simulare. Reviziile transmise sunt păstrate în dosar.' : 'Proiect pentru predarea documentară a lucrării DEMO-L-001, echipament DEMO-TA-001. Documentul nu confirmă o predare înainte de finalizarea explicită a fluxului.',
      sections: [
        { title: 'Datele procesului-verbal', headers: ['Câmp', 'Valoare'], rows: [
          ['Data fictivă din scenariu', delivered ? '12.10.2026' : '12.10.2026 — dată propusă în proiect'],
          ['Beneficiar', 'Operator Apă Exemplu — organizație fictivă'],
          ['Predat de', delivered ? 'Rol demonstrativ coordonator' : 'Rol propus: coordonator — neconfirmat'],
          ['Primit de', delivered ? 'Rol demonstrativ reprezentant beneficiar' : 'Rol propus: reprezentant beneficiar — neconfirmat'],
          ['Identificator pachet', state.deliveredPackage?.id ?? 'Se generează la predarea demonstrativă'],
        ] },
        ...(delivered && state.deliveredPackage ? [{ title: 'Documentele și reviziile transmise', headers: ['Document', 'Revizie'], rows: state.deliveredPackage.documents.map(document => [document.code, document.revision]) }] : [{ title: 'Pachetul propus', body: 'Documentele enumerate în DEMO-B01, la reviziile finale, inclusiv fișa de test după retestare și instrucțiunile operatorului rev. 02. Lista efectivă se păstrează în momentul predării.' }]),
        { title: 'Observații', body: delivered ? 'Fără observații documentare deschise în exemplul predat. Rezultatul inițial al testului și închiderea prin retestare rămân consultabile în dosar.' : 'Rezultatul verificării finale nu este încă consemnat. Consultă DEMO-PRED-001 pentru condițiile și documentele rămase.' },
        { title: 'Limitele confirmării', body: 'Predarea și primirea sunt exclusiv demonstrative. Acest text nu certifică recepția tehnică sau executarea obligațiilor contractuale. Confirmările, autoritatea și semnăturile reale rămân de stabilit.' },
      ],
    },
    {
      id: 'requirements', code: 'DEMO-CER-001', title: 'Cerințe de afișare', revision, status: accepted ? 'Revizia 02 acceptată în simulare' : 'Revizie inițială',
      lead: 'Document suport pentru compararea denumirilor. Conținutul este limitat la afișare și nu descrie comenzi sau logica de funcționare a unui echipament.',
      sections: [
        { title: `Revizia curentă ${revision}`, headers: ['Element demonstrativ', 'Denumire afișată', 'Observație'], rows: [
          ['P-01 — prima stare', 'Funcționare', 'Denumire folosită în scenariu'],
          ['P-01 — a doua stare', accepted ? 'Indisponibil' : 'Oprit', accepted ? 'Denumire acceptată prin DEMO-MOD-001' : 'Etichetă anterioară fictivă, completată pentru PoC'],
        ] },
        { title: accepted ? 'Revizie anterioară 01 — înlocuită' : 'Revizie 02 — propusă, neacceptată', headers: ['Element', 'Rev. 01', 'Rev. 02'], rows: [
          ['Prima stare P-01', 'Funcționare', 'Funcționare'],
          ['A doua stare P-01', 'Oprit', 'Indisponibil'],
          ['Statut', accepted ? 'Înlocuită' : 'Referință inițială', accepted ? 'Acceptată în simulare' : 'În așteptarea deciziei'],
        ] },
        { title: 'Originea completării', body: 'Sursa cere denumirile finale „Funcționare” și „Indisponibil”, dar nu precizează denumirea veche. „Oprit” este o completare exclusiv fictivă, introdusă pentru a face comparația vizibilă. Nu afirmă echivalența tehnică a acestor stări.' },
        { title: 'Documente legate', body: `DEMO-MOD-001 documentează schimbarea; DEMO-LS-001 rev. ${revision} păstrează denumirile; DEMO-TEST-001 rev. ${revision} urmărește corespondența afișării. ${disclaimer}` },
      ],
    },
    {
      id: 'signals', code: 'DEMO-LS-001', title: 'Lista semnalelor demonstrative', revision, status: accepted ? 'Revizia 02 acceptată în simulare' : 'Revizie inițială',
      lead: 'Extras fictiv pentru denumirile afișate ale elementului P-01. Nu este o listă de intrări/ieșiri pentru execuție.',
      sections: [
        { title: 'Denumiri urmărite', headers: ['Element', 'Descriere', 'Etichetă curentă', 'Referință'], rows: [
          ['P-01', 'Prima stare demonstrativă', 'Funcționare', `DEMO-CER-001 rev. ${revision}`],
          ['P-01', 'A doua stare demonstrativă', accepted ? 'Indisponibil' : 'Oprit', `DEMO-CER-001 rev. ${revision}`],
        ] },
        { title: 'Revizia și modificarea', body: accepted ? 'Revizia 02 reflectă denumirile acceptate prin DEMO-MOD-001. Revizia 01 utiliza eticheta fictivă „Oprit” pentru a doua stare și este înlocuită. Implementarea și verificarea sunt urmărite separat.' : 'Revizia 01 este referința inițială. Revizia 02 va reflecta denumirile solicitate numai după acceptarea modificării.' },
        { title: 'Limita extrasului', body: 'Nu sunt definite adrese, tipuri electrice, praguri, parametri, interblocări sau logică de siguranță. „Oprit” este o completare fictivă pentru demonstrație. Lista nu poate fi folosită pentru execuție sau exploatare.' },
      ],
    },
    {
      id: 'manual', code: 'DEMO-MAN-001', title: 'Instrucțiuni operator — extras demonstrativ', revision: manualRevision, status: implemented ? (state.attachments.manualRevision === 2 ? 'Revizia 02 inclusă în pachet' : 'Revizia 02 disponibilă pentru verificare') : 'Revizie inițială',
      lead: 'Extras fictiv limitat la vocabularul interfeței. Nu este un manual de exploatare și nu oferă instrucțiuni pentru operarea unei instalații.',
      sections: [
        { title: `Vocabularul din revizia ${manualRevision}`, headers: ['Element', 'Etichete din document', 'Referință'], rows: [
          ['P-01', implemented ? 'Funcționare / Indisponibil' : 'Funcționare / Oprit', `DEMO-CER-001 rev. ${implemented ? '02' : '01'}`],
        ] },
        ...(implemented ? [{ title: 'Extras din revizia 01 — înlocuită', headers: ['Element', 'Etichete din document', 'Referință'], rows: [
          ['P-01', 'Funcționare / Oprit', 'DEMO-CER-001 rev. 01'],
        ], body: 'Revizia anterioară rămâne consultabilă pentru trasabilitate. „Oprit” este o completare fictivă a scenariului; documentul curent folosește „Indisponibil”.' }] : []),
        { title: 'Pregătire și verificare', body: implemented ? (tested ? 'Revizia 02 a fost pregătită odată cu implementarea și verificată în testul documentar: denumirile corespund cerințelor acceptate. Aceasta nu validează funcționarea tehnică a echipamentului.' : 'Revizia 02 a fost pregătită odată cu implementarea demonstrativă. Verificarea corespondenței denumirilor se va consemna în DEMO-TEST-001; nu există încă rezultat de test.') : 'Revizia 01 este documentul inițial. Revizia 02 va fi disponibilă după consemnarea implementării modificării. Eticheta „Oprit” este o completare fictivă a scenariului.' },
        { title: 'Includerea în pachet', body: state.attachments.manualRevision === 2 ? 'Revizia 02 a fost adăugată explicit în pachet, înlocuind revizia 01 din lista de predare.' : implemented ? 'Pachetul conține încă revizia 01. Disponibilitatea reviziei 02 pentru test nu echivalează cu includerea ei în pachet; aceasta se face explicit în etapa de pregătire a predării.' : 'Pachetul pornește cu revizia 01. Înainte de predare va fi necesară înlocuirea explicită cu revizia finală 02.' },
        { title: 'Limita documentului', body: disclaimer },
      ],
    },
  ];
}

