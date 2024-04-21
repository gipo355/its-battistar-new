export const exitTimer = async function (interval: number) {
  return new Promise<void>((resolve) => {
    const fn = () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit, no-magic-numbers
      resolve(process.exit(0));
    };
    setInterval(fn, interval);
  });
};
