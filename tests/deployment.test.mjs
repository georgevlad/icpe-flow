import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { startServer } from '../server/index.mjs';
import { createInitialState } from '../server/seed.mjs';

async function deploymentDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), 'icpe-deployment-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const staticDirectory = join(directory, 'dist');
  await mkdir(join(staticDirectory, 'assets'), { recursive: true });
  await writeFile(join(staticDirectory, 'index.html'), '<!doctype html><title>ICPE demo</title>');
  await writeFile(join(staticDirectory, 'assets', 'app-hash.js'), 'console.log("demo");');
  await writeFile(join(staticDirectory, 'assets', 'app-hash.css'), 'body{color:red}');
  await writeFile(join(staticDirectory, 'assets', 'font-hash.woff2'), Buffer.from([0, 1, 2, 255]));
  await writeFile(join(staticDirectory, 'logo.png'), Buffer.from([137, 80, 78, 71]));
  await writeFile(join(directory, 'private.txt'), 'not a public asset');
  return { directory, staticDirectory, statePath: join(directory, 'data', 'state.json') };
}

test('one public server serves the frontend, assets, healthcheck and interactive API', async (t) => {
  const paths = await deploymentDirectory(t);
  const { server, port } = await startServer({ ...paths, port: 0, host: '0.0.0.0' });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  assert.equal(server.address().address, '0.0.0.0');
  const url = `http://127.0.0.1:${port}`;
  const index = await fetch(url);
  assert.equal(index.status, 200);
  assert.match(index.headers.get('content-type'), /text\/html/);
  assert.equal(index.headers.get('cache-control'), 'no-cache');
  assert.match(await index.text(), /ICPE demo/);
  for (const [asset, contentType] of [['app-hash.js', 'text/javascript'], ['app-hash.css', 'text/css'], ['font-hash.woff2', 'font/woff2']]) {
    const response = await fetch(`${url}/assets/${asset}`);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(contentType));
    assert.match(response.headers.get('cache-control'), /immutable/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(join(paths.staticDirectory, 'assets', asset)));
  }
  const logo = await fetch(`${url}/logo.png`);
  assert.equal(logo.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await logo.arrayBuffer()), Buffer.from([137, 80, 78, 71]));
  const head = await fetch(url, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), index.headers.get('content-length'));
  assert.equal(await head.text(), '');
  assert.deepEqual(await (await fetch(`${url}/api/health`)).json(), { status: 'ok' });
  assert.deepEqual(await (await fetch(`${url}/api/state`)).json(), createInitialState());
  const action = await fetch(`${url}/api/actions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'accept-change' }) });
  assert.equal(action.status, 200);
  assert.equal((await action.json()).stage, 'implementation');
  assert.equal((await (await fetch(`${url}/api/state`)).json()).stage, 'implementation');
});

test('public file serving rejects traversal and preserves API and missing-file errors', async (t) => {
  const paths = await deploymentDirectory(t);
  const { server, port } = await startServer({ ...paths, port: 0 });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${port}`;
  for (const route of ['/private.txt', '/package.json', '/server/seed.mjs', '/data/state.json', '/assets/missing.js', '/api/missing', '/api']) {
    const response = await fetch(`${url}${route}`);
    assert.equal(response.status, 404, route);
    assert.match(response.headers.get('content-type'), /application\/json/);
  }
  assert.equal((await fetch(`${url}/..%2fprivate.txt`)).status, 403);
  assert.equal((await fetch(`${url}/assets/..%2f..%2fprivate.txt`)).status, 403);
  assert.equal((await fetch(`${url}/%00`)).status, 400);
  assert.equal((await fetch(`${url}/%ZZ`)).status, 400);
  assert.equal((await fetch(`${url}/..%5cprivate.txt`)).status, 400);
  assert.equal((await fetch(url, { method: 'POST' })).status, 404);
  assert.equal((await fetch(`${url}/api/state`, { method: 'POST' })).status, 404);
});

test('deployment entrypoint honors PORT and fresh deploys start from the seed', { timeout: 15_000 }, async (t) => {
  const serverSource = fileURLToPath(new URL('../server/', import.meta.url));
  for (let deployment = 0; deployment < 2; deployment++) {
    const { directory } = await deploymentDirectory(t);
    await cp(serverSource, join(directory, 'server'), { recursive: true });
    const child = spawn(process.execPath, [join(directory, 'server', 'production.mjs')], {
      cwd: directory,
      env: { ...process.env, PORT: '0', API_PORT: '65536' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    const exit = once(child, 'exit');
    t.after(async () => {
      if (child.exitCode === null && child.signalCode === null) child.kill();
      await exit;
    });
    const port = await new Promise((resolve, reject) => {
      let stdout = '';
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
        const match = stdout.match(/http:\/\/0\.0\.0\.0:(\d+)/);
        if (match) resolve(Number(match[1]));
      });
      child.once('error', reject);
      child.once('exit', () => reject(new Error(`Server exited before startup: ${stderr}`)));
    });
    const url = `http://127.0.0.1:${port}`;
    assert.equal((await fetch(url)).status, 200);
    assert.deepEqual(await (await fetch(`${url}/api/state`)).json(), createInitialState());
    const response = await fetch(`${url}/api/actions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'accept-change' }) });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).stage, 'implementation');
    child.kill();
    await exit;
  }
});

test('deployment fails explicitly if the frontend was not built', async (t) => {
  const { directory, statePath } = await deploymentDirectory(t);
  await assert.rejects(startServer({ statePath, staticDirectory: join(directory, 'missing-dist'), port: 0 }), /npm run build/);
});
