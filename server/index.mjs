import { pathToFileURL } from 'node:url';
import { createApiServer } from './app.mjs';
import { createStore } from './store.mjs';

export async function startServer({ port = Number(process.env.API_PORT ?? 3101), statePath, logError } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('API_PORT trebuie să fie un port valid.');
  const store = await createStore({ statePath });
  const server = createApiServer({ store, logError });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return { server, store, port: server.address().port };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().then(({ port }) => {
    console.log(`API demonstrativ local: http://127.0.0.1:${port}`);
  }).catch((error) => {
    console.error('API-ul nu a putut porni:', error.message);
    process.exitCode = 1;
  });
}
