export const exitTimer = async function (interval: number) {
  return new Promise<void>((resolve) => {
    const fn = () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      resolve(process.exit(0));
    };
    setInterval(fn, interval);
  });
};
