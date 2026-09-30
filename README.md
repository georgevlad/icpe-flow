# Dosar de lucrare — PoC ICPE Bistrița

Demonstrație în română, construită cu React, TypeScript, Vite și un API Node.js, pregătită pentru rulare locală sau deploy pe Railway. Un singur scenariu interactiv urmărește schimbarea unei cerințe până la predarea documentelor pentru stația fictivă „Colibița”.

**PoC pentru discuție • Date și proceduri fictive.** Nu reproduce procedurile interne ale firmei, nu constituie validare tehnică și nu este destinat producției.

## Instalare și pornire

Din `D:\codex\icpe-poc`, cu Node.js **22.12+** și npm instalate (verificat cu Node.js 22.14):

```powershell
npm install
npm run dev
```

Deschide [http://127.0.0.1:5173](http://127.0.0.1:5173). Comanda pornește interfața și API-ul local pe portul **3101**. Păstrează terminalul deschis; oprește procesele cu `Ctrl+C`. Fonturile și sigla sunt servite local.

Vite trimite cererile `/api` la `http://127.0.0.1:3101`. Dacă schimbi variabila `API_PORT`, actualizează și destinațiile proxy din `vite.config.ts`. Portul 3101 evită serviciul care ocupa 3001 în mediul verificat.

## Deploy pe Railway

Repository: [georgevlad/icpe-flow](https://github.com/georgevlad/icpe-flow), ramura `main`.

1. În Railway, creează un proiect cu **Deploy from GitHub repo** și selectează `georgevlad/icpe-flow`.
2. Păstrează directorul rădăcină al repository-ului. Railway detectează automat `Dockerfile`, construiește interfața și pornește un singur serviciu Node.js. Nu sunt necesare comenzi personalizate de build sau start ori variabile introduse manual.
3. În setările serviciului, setează **Healthcheck Path** la `/api/health` și păstrează **o singură replică**.
4. În **Networking → Public Networking**, apasă **Generate Domain** și deschide domeniul HTTPS generat.

Serverul ascultă pe `0.0.0.0` și pe `PORT` furnizat de Railway. Interfața, fonturile, sigla și API-ul sunt servite pe același domeniu, fără un serviciu Vite separat sau configurare CORS. Imaginea folosește Node.js 22 și pornește direct serverul, pentru a primi semnalul de oprire al platformei.

**Nu adăuga un volum sau o bază de date.** Starea demonstrației se scrie pe discul temporar al serviciului și se păstrează la reîncărcarea paginii în timpul aceluiași deploy. Fiecare deploy nou pornește de la seed; progresul anterior nu este păstrat. Fișierul local `data/state.json` este exclus din Git și din imaginea Docker.

Toți vizitatorii folosesc aceeași stare demonstrativă și pot modifica sau reseta scenariul. Aplicația nu are autentificare și este destinată prezentării cu date fictive.

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

## Demonstrația de aproximativ cinci minute

1. Deschide dosarul **Colibița** și consultă fluxul, sarcina și documentele. Celelalte lucrări sunt exemple de context.
2. Compară cerințele și acceptă modificarea demonstrativă: apare revizia 02 și sarcina de implementare.
3. Consemnează implementarea, apoi înregistrează testul. Se deschide observația privind eticheta afișată.
4. Înregistrează remedierea și dovada simulată, apoi retestarea distinctă. Observația se închide doar după retestare.
5. Adaugă explicit fișa de test și instrucțiunile rev. 02 în pachet, apoi finalizează predarea. Consultă borderoul, procesul-verbal și istoricul.

Local, datele persistă în `data/state.json`, separat de seed-ul din `server/seed.mjs`; pe Railway fișierul este temporar și nu persistă între deploy-uri. Acțiunea **Resetează demonstrația** readuce modificarea în așteptare, revizia 01 și istoricul inițial, fără test, observație sau pachet predat. Resetarea elimină acțiunile din demonstrația curentă.

## Verificări

```powershell
npm test
npm run build
npm run test:browser
npm run test:browser:production
```

Testele Node acoperă fluxul, stocarea, API-ul și serverul de deploy: fișierele interfeței, protejarea fișierelor private, `PORT`, healthcheck-ul și starea inițială a unui deploy nou. Testele browser folosesc **Microsoft Edge instalat local**, resetează datele demonstrației și verifică fluxul complet, documentele, istoricul, resetarea, conflictele și afișarea desktop/mobil. `test:browser` verifică modul de dezvoltare; `test:browser:production` verifică interfața construită servită direct de Node, după `npm run build`, pe portul 5173. Detaliile verificării sunt în [CONTEXT.md](CONTEXT.md); capturile locale sunt în `artifacts/` (exclus din Git).

## Limite și documentație

Aplicația rulează local sau ca demonstrație publică pe Railway, fără AI, autentificare sau integrări. Documentele, rolurile, implementarea tehnică, testele, dovezile și aprobările sunt fictive. Aplicația gestionează un singur scenariu, fără încărcare/descărcare reală de fișiere ori introducere liberă a testelor. Reviziile istorice sunt extrase, iar stocarea JSON este destinată unui singur proces. Nu există validare tehnică, certificare WCAG sau verificare exhaustivă în toate browserele.

- [CONTEXT.md](CONTEXT.md) — scop, decizii, ipoteze, stadiu și întrebări pentru validare.
- [Simulare-dosar-tablou.md](Simulare-dosar-tablou.md) — scenariul original, păstrat ca referință.

