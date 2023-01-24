export function waitUntil(fn: () => boolean, maxWaitSeconds = 5) {
  return new Promise<void>((resolve, reject) => {
    const startTime = performance.now()

    const interval = setInterval(() => {
      if (performance.now() - startTime > maxWaitSeconds * 1000) {
        reject(new Error('waitUntil timed out'))
      }

      if (fn()) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}
