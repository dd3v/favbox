const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});
worker.onmessage = function ({ data }) {
  switch (data.type) {
    case 'log':
      console.log(`Message: ${data.payload.args}`);
      break;
    default:
      console.log(`ERROR: Unhandled message: ${data.type}`);
  }
};
console.warn('HELLO FROM WORKER');

