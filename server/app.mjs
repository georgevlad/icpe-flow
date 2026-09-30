import { createServer } from 'node:http';
import { WorkflowError } from './workflow.mjs';

function send(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(data));
}

async function readAction(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] ?? '')) {
    throw new WorkflowError('Trimite acțiunea ca application/json.', 400);
  }
  let body = '';
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new WorkflowError('Cererea este prea mare.', 413);
    body += chunk.toString('utf8');
  }
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new WorkflowError('Corpul cererii nu este JSON valid.', 400);
  }
  if (!payload || Array.isArray(payload) || typeof payload !== 'object' || typeof payload.type !== 'string' || Object.keys(payload).some((key) => key !== 'type')) {
    throw new WorkflowError('Cererea trebuie să conțină doar câmpul „type”, de tip text.', 400);
  }
  return payload.type;
}

export function createApiServer({ store, logError = (error) => console.error('API:', error) }) {
  return createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
      if (pathname === '/api/state' && request.method === 'GET') {
        send(response, 200, await store.getState());
      } else if (pathname === '/api/actions' && request.method === 'POST') {
        send(response, 200, await store.dispatch(await readAction(request)));
      } else if (pathname === '/api/reset' && request.method === 'POST') {
        send(response, 200, await store.reset());
      } else {
        send(response, 404, { error: 'Ruta solicitată nu există.' });
      }
    } catch (error) {
      if (error instanceof WorkflowError) {
        send(response, error.status, { error: error.message });
      } else {
        logError(error);
        send(response, 500, { error: 'Starea nu a putut fi citită sau salvată. Acțiunea nu a fost confirmată.' });
      }
    }
  });
}
