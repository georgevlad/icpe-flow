import { pathToFileURL } from 'node:url';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createApiServer } from './app.mjs';
import { createStore } from './store.mjs';

export async function startServer({ port = Number(process.env.PORT ?? process.env.API_PORT ?? 3101), host = '127.0.0.1', staticDirectory, statePath, logError } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT sau API_PORT trebuie să fie un port valid.');
  if (staticDirectory) {
    const index = await stat(join(staticDirectory, 'index.html')).catch(() => null);
    if (!index?.isFile()) throw new Error('Interfața construită lipsește. Rulează npm run build înainte de npm start.');
  }
  const store = await createStore({ statePath });
  const server = createApiServer({ store, staticDirectory, logError });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return { server, store, port: server.address().port };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer({ statePath: process.env.DEMO_STATE_PATH }).then(({ port }) => {
    console.log(`API demonstrativ local: http://127.0.0.1:${port}`);
  }).catch((error) => {
    console.error('API-ul nu a putut porni:', error.message);
    process.exitCode = 1;
  });
}
