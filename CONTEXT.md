# Contextul demonstrației ICPE Bistrița

## Extindere: probă, analiză și raport de laborator — 5 octombrie 2026

Al patrulea scenariu interactiv pornește de la cererea fictivă `DEMO-LAB-001` pentru pH și conductivitate. Urmărește planificarea, identificarea probei `DEMO-PROBA-001`, primirea, două valori inventate, verificarea separată a legăturii dintre înregistrări și raportul demonstrativ `DEMO-RAP-LAB-001` rev. 01. Raportul păstrează un extras al rezultatelor și identificatorul probei; nu are interpretare, verdict de conformitate, semnătură sau valoare de acreditare. Nu au loc recoltări, analize sau transmiteri reale.

Starea folosește schema 4. Stările locale valide din schemele 1–3 sunt verificate prin reluarea istoricului și migrate, păstrând progresul existent. Resetarea reinițializează toate cele patru scenarii. Pașii, responsabilitățile, indicatorii și forma raportului sunt ipoteze exclusiv pentru discuție și trebuie validate cu firma.

Verificarea curentă: 18 teste Node, build-ul TypeScript/Vite și câte 5 teste Playwright pentru versiunea de dezvoltare și cea de producție au trecut. Testele browser folosesc porturi și fișiere de stare separate de previzualizarea locală; progresul acesteia a fost păstrat la migrarea în schema 4. Capturile laboratorului pe desktop și mobil au fost inspectate.

## Extindere: solicitare, ofertă și pornirea lucrării — 5 octombrie 2026

Al treilea scenariu interactiv pornește de la solicitarea fictivă `DEMO-SOL-001` pentru stația fictivă Orizont. Utilizatorul analizează datele lipsă, consemnează clarificările, pregătește `DEMO-OF-001` rev. 01, înregistrează cererea suplimentară pentru a doua sesiune de instruire și pregătește rev. 02. Ambele versiuni rămân consultabile, cu domeniu, ipoteze și valori exclusiv demonstrative. După acceptarea fictivă a rev. 02, fișa de pornire `DEMO-L-004` păstrează versiunea acceptată, sursele predate coordonatorului și lista finală de semnale încă de confirmat. Nu există contract, semnătură, proiect tehnic sau lucrare reală creată.

Scenariul este independent de dosarul Colibița și de intervenția după predare. Starea folosește schema 3; stările locale valide din schema 1 sau 2 sunt verificate prin reluarea istoricului și migrate fără pierderea progresului existent. Resetarea reinițializează toate cele trei scenarii. Fluxul comercial, rolurile, sumele și regulile de acceptare sunt ipoteze pentru discuție, care trebuie validate cu firma.

## Extindere: intervenție după predare — 4 octombrie 2026

La cererea utilizatorului, PoC-ul include acum un al doilea scenariu interactiv, accesibil direct din pagina principală: sesizarea fictivă `DEMO-SRV-001` pentru echipamentul `DEMO-TA-002`, legată de o predare anterioară fictivă `DEMO-PV-002`. Este independent de dosarul Colibița, astfel încât fiecare traseu poate fi demonstrat în orice ordine. Pașii sunt clasificare și atribuire, programare, consemnarea intervenției, verificare separată și confirmarea fictivă a primirii raportului de către beneficiar. Raportul și istoricul se actualizează din aceeași stare.

Starea nouă folosește schema 2. O stare locală validă în schema 1 este verificată prin reluarea istoricului, apoi migrată la schema 2 fără pierderea progresului lucrării. Resetarea readuce ambele scenarii la seed. Ca și dosarul inițial, intervenția este complet simulată: constatarea, corecția, dovada, verificarea și confirmarea sunt precompletate; nu există comenzi către echipamente, programări externe, mesaje trimise sau raport descărcabil. Fluxul și responsabilitățile trebuie validate cu firma înainte de a fi considerate reprezentative.

## Scop și context

Acest proiect este un proof of concept local, vizual și interactiv, pentru o discuție a utilizatorului cu tatăl său despre coordonarea documentelor unei lucrări. ICPE Bistrița este compania tatălui utilizatorului; acesta a menționat că unele procese interne s-ar putea optimiza. Nu avem încă documente reale, probleme validate sau o inventariere a instrumentelor existente. Demonstrația oferă un exemplu care poate fi discutat și corectat împreună, fără a afirma că reproduce procedurile firmei ori că un sistem nou este necesar.

Proiectul este independent de Scriptica și se află în `D:\codex\icpe-poc`. Planul a fost aprobat de utilizator înainte de începerea implementării.

## Informații publice, ipoteze și necunoscute

Cercetarea anterioară furnizată de utilizator a identificat activități de proiectare, execuție și punere în funcțiune pentru instalații de tratare și epurare a apei; tablouri de automatizare personalizate și testarea lor înainte de livrare; laborator de analize fizico-chimice; cercetare cu parteneri și documentație tehnică; soluții PLC și SCADA. Acestea justifică numai tema aleasă. Nu au fost reverificate în această etapă de implementare.

Surse de orientare furnizate:

- [Contact ICPE Bistrița](https://www.icpebn.ro/ro/contact.html)
- [Tratarea apelor](https://www.icpebn.ro/ro/domenii-activitate/tratare-ape)
- [Execuție — electrice și automatizări](https://www.icpebn.ro/ro/domenii-activitate/electrice-si-automatizari/18-executie.html)
- [Analize fizico-chimice](https://www.icpebn.ro/ro/domenii-activitate/analize-fizico-chimice)
- [Proiect 6 PTE 2025](https://www.icpebn.ro/ro/pagini/84-proiect-6-pte-2025.html)

Ipoteze demonstrative: un dosar reunește cerințe, documente, revizii, sarcini, rezultate de test și pachetul predat; coordonarea poate fi explicată printr-un singur flux; denumirile acceptate pentru două stări pot constitui o modificare documentată. Rolurile, datele, lucrările, beneficiarii, confirmările și regulile de trecere sunt fictive.

Necunoscute: procesul real, sistemele deja folosite, sursele documentelor, responsabilitățile și autoritatea de aprobare, cerințele contractuale, controlul reviziilor, semnăturile și valoarea juridică a confirmărilor, necesitatea și utilitatea unui asemenea instrument. Nu presupunem lipsa digitalizării, dificultăți interne sau valabilitatea actuală a certificărilor.

## Scenariul și referințele

La cererea utilizatorului, denumirea afișată a lucrării este acum „Colibița”, în interfață, documentele generate, seed și istoricul persistent. Numele localității este folosit numai pentru scenariul fictiv; nu indică o lucrare ori un beneficiar real. Referința originală de mai jos este păstrată nemodificată și folosește denumirea „Valea Exemplu”. Progresul demonstrației a fost păstrat la redenumire.

Sursa principală, citită integral și păstrată, este [Simulare-dosar-tablou.md](Simulare-dosar-tablou.md). Scenariul descrie modernizarea automatizării stației de tratare „Colibița”, pentru beneficiarul fictiv „Operator Apă Exemplu”: dosarul `DEMO-L-001`, echipamentul `DEMO-TA-001`.

Beneficiarul cere afișarea distinctă a stărilor „Funcționare” și „Indisponibil” pentru P-01. Modificarea acceptată produce revizia 02. Testul găsește o etichetă veche; remedierea are dovadă demonstrativă, iar o retestare separată închide observația. Fișa de test și instrucțiunile finale sunt adăugate explicit la pachet înaintea predării. Eticheta veche „Oprit”, necesară comparației, este o completare fictivă de interfață, nu un detaliu din documentul de referință.

Cele șase documente principale sunt fișa de deschidere `DEMO-F01`, cererea și decizia de modificare `DEMO-MOD-001`, borderoul `DEMO-B01`, fișa de test `DEMO-TEST-001`, lista de predare `DEMO-PRED-001` și procesul-verbal `DEMO-PV-001`. Cerințele `DEMO-CER-001`, lista semnalelor `DEMO-LS-001` și instrucțiunile operatorului `DEMO-MAN-001` sunt documente suport demonstrative.

## Domeniu și limite

Planul versiunii inițiale, aprobat și implementat: vedere de ansamblu cu trei lucrări fictive, un singur dosar complet interactiv, flux vizual, sarcini, documente consultabile în panouri, comparația reviziilor, acțiuni cu ordine validată, istoric, persistență locală și resetare. În versiunea actuală, cele două lucrări de context au fost înlocuite cu scenariile interactive de intervenție, ofertare și laborator descrise mai sus.

Exclusiv date fictive și identificatori `DEMO`. Fără autentificare reală, integrări, AI, servicii plătite, publicare online, configurator de fluxuri, notificări externe sau administrare de utilizatori. Nu există comenzi pentru instalații, parametri tehnici de execuție, afirmații de conformitate ori validare tehnică. Un click demonstrativ nu constituie semnătură juridică. PoC-ul nu înlocuiește ERP, LIMS, PLM, CAD sau SCADA.

## Direcție vizuală și branding

Interfață în română, cu suprafețe deschise, text antracit, accente roșii inspirate din siglă, tipografie îngrijită, spațiere generoasă și animații discrete. Fluxul și legăturile dintre documente, sarcini și rezultate sunt elementele centrale. Sigla existentă `logo.png` este păstrată și copiată stabil în `public/logo.png`, cu proporțiile păstrate. Fonturile DM Sans și Manrope sunt instalate prin pachetele `@fontsource-variable` și servite local, fără cereri către servicii de fonturi. Mențiunea permanentă este „PoC pentru discuție • Date și proceduri fictive”. Brandingul indică destinatarul demonstrației, fără a pretinde adoptare oficială.

## Arhitectură și decizii

React + TypeScript + Vite pentru interfață; modulul HTTP nativ Node.js pentru API-ul local restrâns la scenariu. Datele seed din `server/seed.mjs` sunt separate de fișierul JSON modificabil `data/state.json`, pentru persistență și resetare reproductibilă. API-ul validează ordinea acțiunilor și condițiile de predare; interfața explică starea, iar documentele sunt derivate din aceeași stare. Conflictele de acțiune răspund cu HTTP 409 și determină resincronizarea interfeței cu starea API-ului. Nu sunt necesare bază de date, ORM sau infrastructură de producție.

Este necesar Node.js 22.12 sau mai nou; versiunea folosită la verificare a fost 22.14. După `npm install`, o singură comandă `npm run dev` pornește interfața la `http://127.0.0.1:5173` și API-ul la `http://127.0.0.1:3101`, ambele legate de interfața locală. Portul API 3101 a fost ales deoarece 3001 era ocupat. Vite redirecționează `/api` către portul din `API_PORT` sau către 3101 implicit; `WEB_PORT` poate schimba portul interfeței.

Starea inițială pornește după deschidere și proiectare, la modificarea în așteptare. Revizia 01 rămâne referință istorică. Instrucțiunile rev. 02 devin disponibile pentru verificare după implementare, însă includerea lor în pachet rămâne o acțiune separată. Rezultatul testului inițial se păstrează distinct de retestare. Pachetul final păstrează reviziile transmise.

## Implementat și simulat

Sunt implementate consultarea celor șase documente principale și a celor trei suport, comparația cerințelor rev. 01/02, acceptarea modificării, sarcina și consemnarea implementării, testul inițial, observația, remedierea cu dovadă simulată, retestarea, completarea explicită a pachetului, predarea cu păstrarea reviziilor transmise, istoricul, persistența și resetarea. Pachetele incomplete și acțiunile în ordine greșită sunt respinse de API. Documentele viitoare sunt marcate proiecte și nu consemnează rezultate înainte de acțiunea corespunzătoare.

Prin natura demonstrației, deciziile, implementarea tehnică, testele, dovezile, confirmările și predarea sunt simulate. Nu există introducere liberă a rezultatelor de test, încărcare de fișiere sau descărcare reală a unui pachet. Reviziile vechi CER, LS și MAN sunt reprezentate prin extrase consultabile; aplicația nu gestionează un istoric complet de fișiere. Software-ul operează efectiv asupra stării demonstrației, iar documentele și statusurile reflectă aceste schimbări.

## Stadiu, verificări și probleme cunoscute

Stadiu: aplicația este implementată și verificată cap-coadă. Progresul local a fost păstrat la adăugarea scenariilor noi. Sursa principală și cerințele originale au fost citite integral. Fișierele existente de referință și sigla sunt păstrate.

Verificări efectuate:

- `npm test`: toate cele 18 teste Node au trecut, pentru regulile celor patru fluxuri, migrare, persistență și comportamentul API-ului.
- `npm run build`: compilarea TypeScript și build-ul Vite au trecut la verificarea finală a versiunii finisate, cu fonturile locale incluse.
- `npm run test:browser` și `npm run test:browser:production`: câte 5 teste Playwright cu Microsoft Edge instalat local au trecut; acoperă toate cele patru scenarii, demonstrația completă și comportamentul mobil. Runnerul pornește și oprește servere de test izolate.
- Browser desktop 1440 × 1000 și mobil 390 × 844: cele șase documente principale sunt consultabile, comparația reviziilor este lizibilă și nu există depășire orizontală pe mobil.
- Au fost parcurse toate acțiunile până la predare și cele 10 înregistrări ale istoricului; reîncărcarea înainte de retestare și după predare păstrează starea; resetarea revine complet la seed.
- Nu au fost observate erori JavaScript sau cereri externe în traseul browser verificat. Un conflict HTTP 409 a fost verificat împreună cu resincronizarea interfeței.
- Capturile locale de verificare se află în `artifacts/`, director exclus din Git. Browserul integrat CUA nu a pornit din cauza unei erori de sandbox; verificarea s-a realizat cu Edge headless prin Playwright și capturi inspectate, fără a pretinde o verificare prin CUA.

Finisaje efectuate după verificare: contrast și dimensiuni de text îmbunătățite, meniu de resetare utilizabil pe mobil, resincronizare după conflicte, observație formulată la trecut după remediere și extrasul manualului rev. 01 păstrat vizibil.

Limite cunoscute: patru scenarii fixe, reguli intenționat specifice demonstrației, date JSON pentru un proces local, fără conturi sau administrarea accesului. Nu este pregătită pentru date de producție, utilizatori simultani sau validări inginerești. Verificarea nu reprezintă o matrice exhaustivă de compatibilitate cu browsere ori o certificare WCAG.

## Următorii pași și validarea cu firma

### Pregătirea pentru Railway — 30 septembrie 2026

La cererea utilizatorului, proiectul este acum pregătit pentru deploy demonstrativ pe Railway din repository-ul `georgevlad/icpe-flow`, ramura `main`. Această etapă pregătește sursele; serviciul urmează să fie creat în contul Railway. Cerința explicită este fără persistență între deploy-uri.

Un Dockerfile cu build în două etape construiește React/Vite și livrează doar serverul Node.js, interfața construită și `package.json`. `npm start` servește interfața și API-ul pe același port, cu adresă `0.0.0.0`, prioritate pentru variabila `PORT`, verificarea existenței build-ului și oprire la SIGTERM/SIGINT. Endpoint-ul `/api/health` poate fi folosit pentru healthcheck-ul Railway. Sunt servite doar fișiere din `dist/`, cu tipurile corecte pentru JavaScript, CSS, imagini și fonturi; fișierele sursă și datele JSON nu sunt expuse ca fișiere publice.

Nu sunt necesare volum, bază de date, chei API ori CORS. `data/state.json` rămâne pe discul temporar al serviciului și este exclus din Git și Docker. Fiecare deploy nou începe din seed. Cele patru scenarii au o stare comună tuturor vizitatorilor, fără autentificare; se păstrează o singură replică. Pornirea locală prin Vite rămâne disponibilă pentru dezvoltare.

Verificarea pentru deploy: cele 12 teste Node, build-ul TypeScript/Vite și cele 2 teste browser în fiecare mod (serverul de deploy și Vite pentru dezvoltare) au trecut. Testele verifică inclusiv servirea interfeței, asset-urile și fonturile locale, fișierele private inaccesibile prin HTTP, prioritatea `PORT` și starea inițială la două deploy-uri simulate. Starea locală a revenit la seed după testele browser. Motorul Docker local este oprit, astfel încât imaginea Docker nu a fost construită sau rulată local; serverul folosit în container a fost verificat direct cu Node.js și în browser. Nu s-a făcut încă deploy în Railway.

Verificarea finală este completă. Următorul pas este prezentarea demonstrației, discuția cu tatăl utilizatorului și validarea scenariului cu firma, înainte de orice extindere a funcționalităților.

Întrebări pentru discuția cu tatăl utilizatorului și cu firma:

- Ce parte seamănă cu o lucrare reală și ce trebuie corectat?
- Unde se află astăzi documentele, reviziile, testele și confirmările?
- Ce pași cer căutări, mesaje repetate sau rescriere și ce sistem îi acoperă deja?
- Cine poate accepta o modificare, publica o revizie, închide o observație sau autoriza predarea?
- Ce document real anonimizat ar permite corectarea scenariului?
- Există o nevoie confirmată care justifică un pas următor?

