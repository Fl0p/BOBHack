(() => {
  const namespace = (window.bobContent = window.bobContent || {});

  if (typeof namespace.initializeContentRuntime !== 'function') {
    console.error('Content runtime bootstrap is missing.');
    return;
  }

  try {
    namespace.initializeContentRuntime();
  } catch (error) {
    console.error('Failed to initialize content runtime', error);
  }
})();

