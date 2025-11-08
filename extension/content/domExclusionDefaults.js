(() => {
  const DEFAULT_SELECTORS = ['input[type="file"]', 'input#file-input'];

  const bobNamespace = (window.bobContent = window.bobContent || {});

  const register = (selectors) => {
    if (typeof bobNamespace.addDomExclusionSelectors === 'function') {
      bobNamespace.addDomExclusionSelectors(selectors);
    } else {
      bobNamespace._pendingDomExclusions = (bobNamespace._pendingDomExclusions ?? []).concat(selectors);
    }
  };

  register(DEFAULT_SELECTORS);
})();


