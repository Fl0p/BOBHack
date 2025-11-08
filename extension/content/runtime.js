(() => {
  const globalScope = typeof window !== 'undefined' ? window : globalThis;
  const namespace = (globalScope.bobContent = globalScope.bobContent || {});

  const DEFAULT_MESSAGE_TYPES = Object.freeze({
    COLLECT_DOM: 'COLLECT_DOM',
    PROCESS_DOM: 'PROCESS_DOM',
    APPLY_FIELD_VALUES: 'APPLY_FIELD_VALUES',
    PREPARE_PAGE: 'PREPARE_PAGE'
  });

  namespace.MESSAGE_TYPES = namespace.MESSAGE_TYPES || DEFAULT_MESSAGE_TYPES;

  const registry = (namespace._runtimeRegistry = namespace._runtimeRegistry || {
    instances: namespace.instances || {},
    prefillRegistrations: namespace._pendingPrefillRegistrations
      ? [...namespace._pendingPrefillRegistrations]
      : [],
    prefillServices: [],
    pendingDomExclusions: namespace._pendingDomExclusions || []
  });

  namespace._pendingDomExclusions = registry.pendingDomExclusions;
  namespace.instances = registry.instances;
  delete namespace._pendingPrefillRegistrations;

  const assertDependency = (value, name) => {
    if (typeof value !== 'function') {
      throw new Error(`${name} dependency is not available. Ensure scripts are loaded in manifest.`);
    }
  };

  const ensureInstance = (key, factory) => {
    if (registry.instances[key]) return registry.instances[key];
    registry.instances[key] = factory();
    return registry.instances[key];
  };

  namespace.registerPrefillService = (registration) => {
    if (!registration || typeof registration.create !== 'function') return;
    registry.prefillRegistrations.push(registration);
  };

  namespace.addDomExclusionSelectors = (selectors) => {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    if (!list.length) return;

    if (registry.instances.domExclusionRegistry) {
      registry.instances.domExclusionRegistry.addSelectors(list);
      return;
    }

    registry.pendingDomExclusions.push(...list);
  };

  const ensureDomExclusionsFlushed = () => {
    if (!registry.instances.domExclusionRegistry) return;
    if (!registry.pendingDomExclusions.length) return;
    registry.instances.domExclusionRegistry.addSelectors(registry.pendingDomExclusions);
    registry.pendingDomExclusions.length = 0;
  };

  const ensureCoreInstances = () => {
    assertDependency(namespace.DomExclusionRegistry, 'DomExclusionRegistry');
    assertDependency(namespace.LabelResolver, 'LabelResolver');
    assertDependency(namespace.CssPathBuilder, 'CssPathBuilder');
    assertDependency(namespace.DomSnapshotCollector, 'DomSnapshotCollector');
    assertDependency(namespace.ElementValueSetter, 'ElementValueSetter');
    assertDependency(namespace.FieldValueApplier, 'FieldValueApplier');

    const domExclusionRegistry = ensureInstance(
      'domExclusionRegistry',
      () => new namespace.DomExclusionRegistry()
    );

    ensureDomExclusionsFlushed();

    const labelResolver = ensureInstance('labelResolver', () => new namespace.LabelResolver());
    const pathBuilder = ensureInstance('pathBuilder', () => new namespace.CssPathBuilder());

    const snapshotCollector = ensureInstance(
      'snapshotCollector',
      () =>
        new namespace.DomSnapshotCollector({
          labelResolver,
          pathBuilder,
          exclusionRegistry: domExclusionRegistry
        })
    );

    const elementValueSetter = ensureInstance(
      'elementValueSetter',
      () => new namespace.ElementValueSetter()
    );

    const fieldValueApplier = ensureInstance(
      'fieldValueApplier',
      () =>
        new namespace.FieldValueApplier({
          elementValueSetter
        })
    );

    return {
      domExclusionRegistry,
      labelResolver,
      pathBuilder,
      snapshotCollector,
      elementValueSetter,
      fieldValueApplier
    };
  };

  const ensurePagePreparers = (dependencies) => {
    const pagePreparers = namespace.pagePreparers ?? [];

    registry.prefillRegistrations.forEach((registration) => {
      if (registry.prefillServices.includes(registration)) return;
      try {
        const service = registration.create(dependencies);
        if (service && typeof service.prepare === 'function' && !pagePreparers.includes(service)) {
          pagePreparers.push(service);
          if (registration.key) {
            registry.instances[registration.key] = service;
          }
        }
        registry.prefillServices.push(registration);
      } catch (error) {
        console.error('Prefill service registration failed', registration.id ?? 'unknown', error);
      }
    });

    namespace.pagePreparers = pagePreparers;
    return pagePreparers;
  };

  const ensureMessageRouter = ({ snapshotCollector, fieldValueApplier, pagePreparers }) => {
    assertDependency(namespace.MessageRouter, 'MessageRouter');
    if (namespace.routerInstance) return namespace.routerInstance;

    const router = new namespace.MessageRouter({
      snapshotCollector,
      fieldValueApplier,
      pagePreparers
    });

    router.register();
    namespace.routerInstance = router;
    return router;
  };

  namespace.initializeContentRuntime = () => {
    const dependencies = ensureCoreInstances();
    const pagePreparers = ensurePagePreparers(dependencies);
    ensureMessageRouter({
      snapshotCollector: dependencies.snapshotCollector,
      fieldValueApplier: dependencies.fieldValueApplier,
      pagePreparers
    });
    namespace.domExclusionRegistry = dependencies.domExclusionRegistry;
    namespace._runtimeInitialized = true;
    return dependencies;
  };
})();


