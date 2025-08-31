export function createDataResource(
  url: string,
  onProgress: (p: number) => void
) {
  let status = 'pending';
  let result: object;
  const suspender = new Promise<void>((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/data.worker.ts', import.meta.url)
    );
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        onProgress(msg.percent);
      } else if (msg.type === 'done') {
        status = 'success';
        result = msg;
        resolve();
      }
    };
    worker.onerror = (err) => {
      status = 'error';
      result = err;
      reject(err);
    };
    worker.postMessage(url);
  });

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    },
  };
}
