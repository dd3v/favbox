let worker = null;

/**
 *
 */
export function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('@/workers/ping.js', import.meta.url), { type: 'module' });
    // worker = new Worker(browser.runtime.getURL('workers/ping.js'), { type: 'module' });
  }
  return worker;
}

/**
 *
 */
export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
