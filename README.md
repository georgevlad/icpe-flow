# Dosar de lucrare — PoC ICPE Bistrița

Demonstrație locală în română, construită cu React, TypeScript, Vite și un API Node.js. Un singur scenariu interactiv urmărește schimbarea unei cerințe până la predarea documentelor pentru stația fictivă „Colibița”.

**PoC pentru discuție • Date și proceduri fictive.** Nu reproduce procedurile interne ale firmei, nu constituie validare tehnică și nu este destinat producției.

## Instalare și pornire

Din `D:\codex\icpe-poc`, cu Node.js **22.12+** și npm instalate (verificat cu Node.js 22.14):

```powershell
npm install
npm run dev
```

Deschide [http://127.0.0.1:5173](http://127.0.0.1:5173). Comanda pornește interfața și API-ul local pe portul **3101**. Păstrează terminalul deschis; oprește procesele cu `Ctrl+C`. Fonturile și sigla sunt servite local.

Vite trimite cererile `/api` la `http://127.0.0.1:3101`. Dacă schimbi variabila `API_PORT`, actualizează și destinațiile proxy din `vite.config.ts`. Portul 3101 evită serviciul care ocupa 3001 în mediul verificat.

## Demonstrația de aproximativ cinci minute

1. Deschide dosarul **Colibița** și consultă fluxul, sarcina și documentele. Celelalte lucrări sunt exemple de context.
2. Compară cerințele și acceptă modificarea demonstrativă: apare revizia 02 și sarcina de implementare.
3. Consemnează implementarea, apoi înregistrează testul. Se deschide observația privind eticheta afișată.
4. Înregistrează remedierea și dovada simulată, apoi retestarea distinctă. Observația se închide doar după retestare.
5. Adaugă explicit fișa de test și instrucțiunile rev. 02 în pachet, apoi finalizează predarea. Consultă borderoul, procesul-verbal și istoricul.

Datele persistă în `data/state.json`, separat de seed-ul din `server/seed.mjs`. Acțiunea **Resetează demonstrația** readuce modificarea în așteptare, revizia 01 și istoricul inițial, fără test, observație sau pachet predat. Resetarea elimină acțiunile din demonstrația curentă. Starea livrată este pregătită la începutul traseului.

## Verificări

```powershell
npm test
npm run build
npm run test:browser
```

Au trecut cele 8 teste Node, build-ul final TypeScript + Vite și cele 2 teste Playwright. Testele browser folosesc **Microsoft Edge instalat local**, pornesc aplicația sau reutilizează serverul existent și resetează datele demonstrației. Au fost verificate fluxul complet, documentele, istoricul, persistența, resetarea, conflictele și afișarea desktop/mobil. Detaliile verificării finale sunt în [CONTEXT.md](CONTEXT.md); capturile locale sunt în `artifacts/` (exclus din Git).

## Limite și documentație

Totul rulează local, fără AI, autentificare, integrări sau publicare online. Documentele, rolurile, implementarea tehnică, testele, dovezile și aprobările sunt fictive. Aplicația gestionează un singur scenariu, fără încărcare/descărcare reală de fișiere ori introducere liberă a testelor. Reviziile istorice sunt extrase, iar stocarea JSON este destinată unui singur proces local. Nu există validare tehnică, certificare WCAG sau verificare exhaustivă în toate browserele.

- [CONTEXT.md](CONTEXT.md) — scop, decizii, ipoteze, stadiu și întrebări pentru validare.
- [Simulare-dosar-tablou.md](Simulare-dosar-tablou.md) — scenariul original, păstrat ca referință.

