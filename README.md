# Dosar de lucrare — PoC ICPE Bistrița

Demonstrație în română, construită cu React, TypeScript, Vite și un API Node.js, pregătită pentru rulare locală sau deploy pe Railway. Patru scenarii interactive urmăresc ofertarea, o lucrare fictivă până la predare, o probă de laborator demonstrativă și o intervenție după o predare anterioară.

**PoC pentru discuție • Date și proceduri fictive.** Nu reproduce procedurile interne ale firmei, nu constituie validare tehnică și nu este destinat producției.

## Instalare și pornire

Din `D:\codex\icpe-poc`, cu Node.js **22.12+** și npm instalate (verificat cu Node.js 22.14):

```powershell
npm install
npm run dev
```

Deschide [http://127.0.0.1:5173](http://127.0.0.1:5173). Comanda pornește interfața și API-ul local pe portul **3101**. Păstrează terminalul deschis; oprește procesele cu `Ctrl+C`. Fonturile și sigla sunt servite local.

Vite trimite cererile `/api` la `http://127.0.0.1:3101` implicit. `API_PORT` și `WEB_PORT` pot schimba porturile API-ului și interfeței; proxy-ul urmează automat `API_PORT`. Portul 3101 evită serviciul care ocupa 3001 în mediul verificat.

## Deploy pe Railway

Repository: [georgevlad/icpe-flow](https://github.com/georgevlad/icpe-flow), ramura `main`.

1. În Railway, creează un proiect cu **Deploy from GitHub repo** și selectează `georgevlad/icpe-flow`.
2. Păstrează directorul rădăcină al repository-ului. Railway detectează automat `Dockerfile`, construiește interfața și pornește un singur serviciu Node.js. Nu sunt necesare comenzi personalizate de build sau start ori variabile introduse manual.
3. În setările serviciului, setează **Healthcheck Path** la `/api/health` și păstrează **o singură replică**.
4. În **Networking → Public Networking**, apasă **Generate Domain** și deschide domeniul HTTPS generat.

Serverul ascultă pe `0.0.0.0` și pe `PORT` furnizat de Railway. Interfața, fonturile, sigla și API-ul sunt servite pe același domeniu, fără un serviciu Vite separat sau configurare CORS. Imaginea folosește Node.js 22 și pornește direct serverul, pentru a primi semnalul de oprire al platformei.

**Nu adăuga un volum sau o bază de date.** Starea demonstrației se scrie pe discul temporar al serviciului și se păstrează la reîncărcarea paginii în timpul aceluiași deploy. Fiecare deploy nou pornește de la seed; progresul anterior nu este păstrat. Fișierul local `data/state.json` este exclus din Git și din imaginea Docker.

Toți vizitatorii folosesc aceeași stare demonstrativă și pot modifica sau reseta cele patru scenarii. Aplicația nu are autentificare și este destinată prezentării cu date fictive.

Referințe: [Dockerfile pe Railway](https://docs.railway.com/builds/dockerfiles), [healthcheck](https://docs.railway.com/deployments/healthchecks), [domeniu public](https://docs.railway.com/networking/public-networking).

## Verificarea locală a versiunii de deploy

```powershell
npm ci
npm run build
npm start
```

Deschide [http://127.0.0.1:3101](http://127.0.0.1:3101). `npm start` servește interfața din `dist/` împreună cu API-ul. `PORT` are prioritate față de `API_PORT`; implicit se folosește portul 3101. Dacă build-ul lipsește, pornirea este oprită cu un mesaj explicit.

Cu Docker disponibil, aceeași imagine poate fi verificată astfel:

```powershell
docker build -t icpe-flow .
docker run --rm -p 8080:8080 -e PORT=8080 icpe-flow
```

Deschide [http://127.0.0.1:8080](http://127.0.0.1:8080). Nu se montează volume.

## Solicitare → ofertă → pornirea lucrării — aproximativ patru minute

Din pagina **Scenarii**, deschide **Solicitare și ofertă**. Este un caz independent pentru stația fictivă „Orizont”, cu date și sume inventate exclusiv pentru demonstrație.

1. Analizează solicitarea și consemnează clarificările primite de la beneficiarul fictiv. Un punct rămâne explicit de confirmat la deschiderea lucrării.
2. Pregătește oferta `DEMO-OF-001` rev. 01, înregistrează cererea de ajustare și pregătește rev. 02. Fila **Oferte** păstrează ambele versiuni, domeniul, ipotezele și diferența de valoare demonstrativă.
3. Consemnează acceptarea fictivă a rev. 02 și creează fișa de pornire `DEMO-L-004`. Fila **Pornire** arată exact ce se transmite coordonatorului și ce rămâne de clarificat. **Istoric** păstrează pașii.

Acceptarea este simulată și nu reprezintă semnătură, contract sau ofertă reală a firmei. Scenariul se oprește la pornirea lucrării; execuția este ilustrată separat în dosarul Colibița.

## Lucrarea Colibița — aproximativ cinci minute

Secțiunea **Ajutor**, din meniul lateral sau din partea de jos a paginii, explică pe scurt dosarul, documentele, pașii de lucru, predarea și resetarea. Apasă pe o întrebare pentru detalii; pe telefon, meniul se deschide din butonul de sus.

1. Deschide dosarul **Colibița** și consultă fluxul, sarcina și documentele. Ofertarea, laboratorul și intervenția sunt scenarii separate.
2. Compară cerințele și acceptă modificarea demonstrativă: apare revizia 02 și sarcina de implementare.
3. Consemnează implementarea, apoi înregistrează testul. Se deschide observația privind eticheta afișată.
4. Înregistrează remedierea și dovada simulată, apoi retestarea distinctă. Observația se închide doar după retestare.
5. Adaugă explicit fișa de test și instrucțiunile rev. 02 în pachet, apoi finalizează predarea. Consultă borderoul, procesul-verbal și istoricul.

## Probă → analiză → raport de laborator — aproximativ trei minute

Din pagina **Scenarii**, deschide **Probă și raport**. Cazul independent `DEMO-LAB-001` urmărește o singură probă fictivă de la cerere până la raport.

1. Planifică și consemnează recoltarea. Proba primește identificatorul `DEMO-PROBA-001`, care rămâne vizibil la primire, analiză și în raport.
2. Înregistrează primirea în laborator și cele două valori inventate pentru pH și conductivitate. Fila **Probă și analiză** arată persoanele și momentele consemnate.
3. Consemnează verificarea separată a înregistrărilor, apoi emite raportul fictiv `DEMO-RAP-LAB-001` rev. 01. Consultă filele **Raport** și **Istoric**.

Valorile nu provin din măsurători. Raportul nu este buletin de analiză, nu include interpretare sau verdict de conformitate și nu are valoare de acreditare. Nu există recoltare, semnătură, fișier descărcabil sau transmitere reală.

## Intervenția după predare — aproximativ trei minute

Din pagina **Scenarii**, deschide **Intervenție după predare**. Acest caz este independent de dosarul Colibița și pornește de la o predare anterioară fictivă (`DEMO-PV-002`) pentru un alt echipament (`DEMO-TA-002`). Poți parcurge scenariile în orice ordine.

1. Citește sesizarea fictivă privind actualizarea datelor afișate; clasifică și atribuie cazul.
2. Consemnează programarea verificării și intervenția demonstrativă, cu constatare, acțiune și dovadă simulate.
3. Confirmă verificarea separată a rezultatului, apoi înregistrează primirea raportului de către beneficiarul fictiv și închide sesizarea.
4. Consultă filele **Raport** și **Istoric**. Reîncărcarea paginii păstrează progresul tuturor scenariilor; **Resetează demonstrația** le readuce pe toate la starea inițială.

Acțiunile, programarea, verificarea și confirmarea sunt precompletate pentru demonstrație. Nu se trimit notificări și nu se operează echipamente reale.

Local, datele persistă în `data/state.json`, separat de seed-ul din `server/seed.mjs`; pe Railway fișierul este temporar și nu persistă între deploy-uri. O stare locală validă din versiunile anterioare este migrată la pornire, păstrând progresul existent. Acțiunea **Resetează demonstrația** readuce cele patru scenarii la datele inițiale și elimină acțiunile din demonstrația curentă.

## Verificări

```powershell
npm test
npm run build
npm run test:browser
npm run test:browser:production
```

Testele Node acoperă fluxul, stocarea, API-ul și serverul de deploy: fișierele interfeței, protejarea fișierelor private, `PORT`, healthcheck-ul și starea inițială a unui deploy nou. Testele browser folosesc **Microsoft Edge instalat local**, resetează numai starea lor izolată și verifică fluxurile, documentele, istoricul, resetarea, conflictele și afișarea desktop/mobil. `test:browser` folosește porturile 5174/3102 și `data/browser-dev-state.json`; `test:browser:production` verifică interfața construită servită direct de Node, după `npm run build`, pe portul 5175 și `data/browser-prod-state.json`. Previzualizarea locală pe 5173/3101 își păstrează starea. Detaliile verificării sunt în [CONTEXT.md](CONTEXT.md); capturile locale sunt în `artifacts/` (exclus din Git).

## Limite și documentație

Aplicația rulează local sau ca demonstrație publică pe Railway, fără AI, autentificare sau integrări. Documentele, rolurile, implementarea tehnică, testele, dovezile, ofertele, rezultatele de laborator și aprobările sunt fictive. Aplicația gestionează patru scenarii fixe, fără încărcare/descărcare reală de fișiere ori introducere liberă a testelor, datelor intervenției, ofertelor sau rezultatelor de laborator. Reviziile istorice sunt extrase, iar stocarea JSON este destinată unui singur proces. Nu există validare tehnică, certificare WCAG sau verificare exhaustivă în toate browserele.

- [CONTEXT.md](CONTEXT.md) — scop, decizii, ipoteze, stadiu și întrebări pentru validare.
- [Simulare-dosar-tablou.md](Simulare-dosar-tablou.md) — scenariul original, păstrat ca referință.

