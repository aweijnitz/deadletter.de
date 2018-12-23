exports.mountShutdownHandlers =  function mountShutdownHandlers(shutDownHandler) {
  // Be nice process citizen and respect OS signals
  process.on('SIGTERM', async function () {
    await shutDownHandler();
    console.log('SHUTDOWN (TERMINATED)');
    process.exit(0);
  });
  process.on('SIGINT', async function () {
    await shutDownHandler();
    console.log('SHUTDOWN (INTERRUPTED)');
    process.exit(0);
  });
  process.on('SIGTSTP', async function () {
    await shutDownHandler();
    console.log('SHUTDOWN (STOPPED)');
    process.exit(0);
  });
};
