import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { WorkflowError } from './workflow.mjs';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export function createStaticHandler(directory) {
  const root = resolve(directory);
  return async (request, response, pathname) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return false;
    let decoded;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      throw new WorkflowError('Ruta solicitată nu este validă.', 400);
    }
    if (decoded.includes('\0') || decoded.includes('\\')) throw new WorkflowError('Ruta solicitată nu este validă.', 400);
    const filePath = resolve(root, decoded === '/' ? 'index.html' : `.${decoded}`);
    const withinRoot = relative(root, filePath);
    if (withinRoot === '..' || withinRoot.startsWith(`..${sep}`) || isAbsolute(withinRoot)) {
      throw new WorkflowError('Ruta solicitată nu este permisă.', 403);
    }
    let body;
    try {
      body = await readFile(filePath);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) return false;
      throw error;
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': decoded.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
    return true;
  };
}
