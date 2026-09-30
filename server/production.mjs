import { fileURLToPath } from 'node:url';
import { startServer } from './index.mjs';

const staticDirectory = fileURLToPath(new URL('../dist/', import.meta.url));

try {
  const { server, port } = await startServer({ host: '0.0.0.0', staticDirectory });
  console.log(`Demonstrație ICPE: http://0.0.0.0:${port}`);
  const shutdown = () => {
    const timeout = setTimeout(() => server.closeAllConnections(), 10_000);
    timeout.unref();
    server.close(() => clearTimeout(timeout));
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
} catch (error) {
  console.error('Demonstrația nu a putut porni:', error.message);
  process.exitCode = 1;
}
