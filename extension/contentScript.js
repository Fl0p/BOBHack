(() => {
  const bobNamespace = window.bobContent || {};
  const instances = bobNamespace.instances ?? {};

  const dependencies = [
    ['DomExclusionRegistry', bobNamespace.DomExclusionRegistry],
    ['LabelResolver', bobNamespace.LabelResolver],
    ['CssPathBuilder', bobNamespace.CssPathBuilder],
    ['DomSnapshotCollector', bobNamespace.DomSnapshotCollector],
    ['ElementValueSetter', bobNamespace.ElementValueSetter],
    ['FieldValueApplier', bobNamespace.FieldValueApplier],
    ['OlxPrefillService', bobNamespace.OlxPrefillService],
    ['AllegroLokalniePrefillService', bobNamespace.AllegroLokalniePrefillService],
    ['MessageRouter', bobNamespace.MessageRouter]
  ];

  const missing = dependencies.filter(([, value]) => typeof value !== 'function').map(([name]) => name);
  if (missing.length) {
    console.error('Content script dependencies missing', missing);
  } else {
    if (!instances.domExclusionRegistry) instances.domExclusionRegistry = new bobNamespace.DomExclusionRegistry();
    if (!instances.labelResolver) instances.labelResolver = new bobNamespace.LabelResolver();
    if (!instances.pathBuilder) instances.pathBuilder = new bobNamespace.CssPathBuilder();
    if (!instances.snapshotCollector)
      instances.snapshotCollector = new bobNamespace.DomSnapshotCollector({
        labelResolver: instances.labelResolver,
        pathBuilder: instances.pathBuilder,
        exclusionRegistry: instances.domExclusionRegistry
      });
    if (!instances.elementValueSetter) instances.elementValueSetter = new bobNamespace.ElementValueSetter();
    if (!instances.fieldValueApplier)
      instances.fieldValueApplier = new bobNamespace.FieldValueApplier({
        elementValueSetter: instances.elementValueSetter
      });

    if (!instances.olxPrefillService)
      instances.olxPrefillService = new bobNamespace.OlxPrefillService({
        elementValueSetter: instances.elementValueSetter
      });

    if (!instances.allegroLokalniePrefillService)
      instances.allegroLokalniePrefillService =
        new bobNamespace.AllegroLokalniePrefillService({
          elementValueSetter: instances.elementValueSetter
        });

    const pagePreparers = bobNamespace.pagePreparers ?? [];
    if (instances.olxPrefillService && !pagePreparers.includes(instances.olxPrefillService)) {
      pagePreparers.push(instances.olxPrefillService);
    }
    if (
      instances.allegroLokalniePrefillService &&
      !pagePreparers.includes(instances.allegroLokalniePrefillService)
    ) {
      pagePreparers.push(instances.allegroLokalniePrefillService);
    }

    bobNamespace.instances = instances;
    bobNamespace.pagePreparers = pagePreparers;
    bobNamespace.domExclusionRegistry = instances.domExclusionRegistry;
    bobNamespace.addDomExclusionSelectors =
      bobNamespace.addDomExclusionSelectors ||
      ((selectors) => {
        const list = Array.isArray(selectors) ? selectors : [selectors];
        instances.domExclusionRegistry.addSelectors(list);
      });
    if (bobNamespace._pendingDomExclusions?.length) {
      bobNamespace.addDomExclusionSelectors(bobNamespace._pendingDomExclusions);
      delete bobNamespace._pendingDomExclusions;
    }

    if (!bobNamespace.routerInstance) {
      const messageRouter = new bobNamespace.MessageRouter({
        snapshotCollector: instances.snapshotCollector,
        fieldValueApplier: instances.fieldValueApplier,
        pagePreparers: bobNamespace.pagePreparers ?? []
      });
      messageRouter.register();
      bobNamespace.routerInstance = messageRouter;
    }
  }

  window.bobContent = bobNamespace;
})();

