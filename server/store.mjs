import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createInitialState } from './seed.mjs';
import { applyAction, validatePersistedState } from './workflow.mjs';

export const DEFAULT_STATE_PATH = fileURLToPath(new URL('../data/state.json', import.meta.url));

export async function persistState(path, state) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryPath, path);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

export async function createStore({ statePath = DEFAULT_STATE_PATH, now = () => new Date(), persist = persistState } = {}) {
  let state;
  try {
    const saved = JSON.parse(await readFile(statePath, 'utf8'));
    state = validatePersistedState(saved, createInitialState());
    if (saved.schemaVersion !== state.schemaVersion) await persist(statePath, state);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    state = createInitialState();
    await persist(statePath, state);
  }
  let pending = Promise.resolve();
  const enqueue = (operation) => {
    const result = pending.then(operation);
    pending = result.catch(() => {});
    return result;
  };
  const commit = async (nextState) => {
    await persist(statePath, nextState);
    state = nextState;
    return structuredClone(state);
  };
  return {
    getState: () => enqueue(() => structuredClone(state)),
    dispatch: (type) => enqueue(() => commit(applyAction(state, type, now().toISOString()))),
    reset: () => enqueue(() => commit(createInitialState())),
  };
}
