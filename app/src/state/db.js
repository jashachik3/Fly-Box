// Singletons. The store picks IndexedDB in a browser and falls back to memory
// anywhere else, so the same modules run under Node in tools/log-demo.mjs.

import { createStore } from '../user/store.mjs';
import { createLog } from '../user/log.mjs';

export const store = createStore();
export const log = createLog(store);
