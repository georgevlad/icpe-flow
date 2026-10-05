import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const production = process.argv[2] === 'production';
const servers = [];

function start(script, args, env) {
  const child = spawn(process.execPath, [resolve(script), ...args], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  servers.push(child);
  return child;
}

async function ready(url, child) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Serverul de test s-a închis înainte de ${url}.`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* Serverul încă pornește. */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Serverul de test nu a pornit la ${url}.`);
}

async function stop(child) {
  if (child.exitCode !== null || child.pid === undefined) return;
  const exited = new Promise(resolve => child.once('exit', resolve));
  child.kill();
  if (await Promise.race([exited.then(() => true), new Promise(resolve => setTimeout(() => resolve(false), 2000))])) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F']);
}

try {
  if (production) {
    const server = start('server/production.mjs', [], { PORT: '5175', DEMO_STATE_PATH: 'data/browser-prod-state.json' });
    await ready('http://127.0.0.1:5175/api/health', server);
  } else {
    const api = start('server/index.mjs', [], { API_PORT: '3102', DEMO_STATE_PATH: 'data/browser-dev-state.json' });
    await ready('http://127.0.0.1:3102/api/health', api);
    const web = start('node_modules/vite/bin/vite.js', ['--host', '127.0.0.1'], { API_PORT: '3102', WEB_PORT: '5174' });
    await ready('http://127.0.0.1:5174', web);
  }
  const args = [resolve('node_modules/@playwright/test/cli.js'), 'test'];
  if (production) args.push('--config', 'playwright.production.config.ts');
  args.push(...process.argv.slice(3));
  const result = await new Promise((resolve, reject) => {
    const runner = spawn(process.execPath, args, { stdio: 'inherit' });
    runner.once('error', reject);
    runner.once('exit', code => resolve(code ?? 1));
  });
  process.exitCode = result;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  for (const server of servers.reverse()) await stop(server);
}
