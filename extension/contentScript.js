(() => {
  const bobNamespace = window.bobContent || {};
  const instances = bobNamespace.instances ?? {};

  const dependencies = [
    ['LabelResolver', bobNamespace.LabelResolver],
    ['CssPathBuilder', bobNamespace.CssPathBuilder],
    ['DomSnapshotCollector', bobNamespace.DomSnapshotCollector],
    ['ElementValueSetter', bobNamespace.ElementValueSetter],
    ['FieldValueApplier', bobNamespace.FieldValueApplier],
    ['MessageRouter', bobNamespace.MessageRouter]
  ];

  const missing = dependencies.filter(([, value]) => typeof value !== 'function').map(([name]) => name);
  if (missing.length) {
    console.error('Content script dependencies missing', missing);
  } else {
    if (!instances.labelResolver) instances.labelResolver = new bobNamespace.LabelResolver();
    if (!instances.pathBuilder) instances.pathBuilder = new bobNamespace.CssPathBuilder();
    if (!instances.snapshotCollector)
      instances.snapshotCollector = new bobNamespace.DomSnapshotCollector({
        labelResolver: instances.labelResolver,
        pathBuilder: instances.pathBuilder
      });
    if (!instances.elementValueSetter) instances.elementValueSetter = new bobNamespace.ElementValueSetter();
    if (!instances.fieldValueApplier)
      instances.fieldValueApplier = new bobNamespace.FieldValueApplier({
        elementValueSetter: instances.elementValueSetter
      });

    bobNamespace.instances = instances;

    if (!bobNamespace.routerInstance) {
      const messageRouter = new bobNamespace.MessageRouter({
        snapshotCollector: instances.snapshotCollector,
        fieldValueApplier: instances.fieldValueApplier
      });
      messageRouter.register();
      bobNamespace.routerInstance = messageRouter;
    }
  }

  window.bobContent = bobNamespace;
})();

