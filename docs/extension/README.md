# browser extension

## overview

BOBHack includes a browser extension for enhanced web interaction and form automation capabilities.

## structure

The extension is located in the `extension/` directory with the following architecture:

```
extension/
├── manifest.json                # Extension manifest (MV3)
├── contentScript.js             # Slim bootstrap for runtime initialization
├── src/common/messageTypes.js   # Shared message type constants
├── content/
│   ├── runtime.js               # Dependency bootstrap & service registry
│   ├── domExclusionRegistry.js  # Exclusion selector registry
│   ├── domExclusionDefaults.js  # Default exclusion selectors
│   ├── labelResolver.js         # Field label lookup
│   ├── cssPathBuilder.js        # CSS selector generation
│   ├── domSnapshotCollector.js  # DOM snapshot authoring
│   ├── elementValueSetter.js    # Element value manipulation
│   ├── fieldValueApplier.js     # Field population logic
│   └── messageRouter.js         # Content-side message router
├── background/
│   ├── index.js                 # Service worker entrypoint
│   ├── processDom.js            # DOM processing orchestration (DI friendly)
│   ├── domPayload.js            # DOM payload formatting
│   ├── difyClient.js            # Dify HTTP client
│   ├── fieldExtractor.js        # Field extraction from Dify response
│   └── tabMessenger.js          # Messaging helper for content script bridge
├── sites/
│   ├── allegrolokalnie/
│   │   └── prefillService.js    # Site-specific preparer registration
│   └── olx/
│       └── prefillService.js    # Site-specific preparer registration
├── popup.html                   # Extension popup UI
└── popup.js                     # Popup logic (ES module)
```

## architecture

### modular design

The extension uses a thin runtime bootstrap to assemble dependencies at execution time:
- `content/runtime.js` validates and instantiates core services only once
- Prefill handlers self-register through `registerPrefillService`, keeping the system open for extension
- Shared `MESSAGE_TYPES` are sourced from `src/common/messageTypes.js` and reused across background, popup, and content scripts
- Background orchestration (`processDom.js`) is built through dependency injection, easing future substitutions and testing

### key components

#### content scripts

**cssPathBuilder.js** (extension/content/cssPathBuilder.js)
- Generates unique CSS selectors for DOM elements
- Builds optimal selector paths for reliable element targeting

**domSnapshotCollector.js** (extension/content/domSnapshotCollector.js)
- Captures DOM snapshots
- Collects form structure and element hierarchy

**elementValueSetter.js** (extension/content/elementValueSetter.js)
- Sets values for form elements
- Handles different input types (text, select, checkbox, radio)

**fieldValueApplier.js** (extension/content/fieldValueApplier.js)
- Applies extracted field values to form elements
- Manages field mapping and value transformation

**labelResolver.js** (extension/content/labelResolver.js)
- Resolves labels associated with form fields
- Handles various label association patterns

**runtime.js** (extension/content/runtime.js)
- Centralizes dependency creation and memoization
- Exposes `registerPrefillService` for site-specific preparers
- Ensures a single `MessageRouter` instance per tab

**messageRouter.js** (extension/content/messageRouter.js)
- Routes messages between content scripts and background using `MESSAGE_TYPES`
- Invokes registered page preparers before applying returned values

#### background scripts

**domPayload.js** (extension/background/domPayload.js)
- Processes DOM payload data
- Handles payload validation and transformation

**fieldExtractor.js** (extension/background/fieldExtractor.js)
- Enhanced field extraction logic
- Identifies form fields and their properties
- Extracts metadata for intelligent form filling

## features

- **form field extraction**: Automatically identifies and extracts form fields
- **intelligent field mapping**: Maps extracted data to appropriate form fields
- **dom snapshot capture**: Captures complete DOM structure for analysis
- **css selector generation**: Generates reliable CSS selectors for elements
- **label resolution**: Associates labels with form inputs using multiple strategies

## manifest v3

The extension uses Manifest V3 specification for:
- Enhanced security model
- Service worker-based background scripts
- Improved performance and resource management

## recent updates

### runtime refactor
- Introduced `content/runtime.js` to bootstrap dependencies and manage prefill services
- Migrated popup script to an ES module sharing `MESSAGE_TYPES`
- Centralized background DOM processing via `createProcessDomSnapshot` factory
- Removed ad-hoc logging and tightened error propagation for cleaner console output

## usage

1. Load the extension in Chrome/Edge:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` directory

2. The extension will be available in your browser toolbar

## development

The extension is under active development with focus on:
- Improved form field detection
- Enhanced automation capabilities
- Better error handling
- Cross-browser compatibility

## security considerations

- Extension uses content security policy (CSP) restrictions
- Minimal permissions requested
- Isolated execution contexts for content scripts
- No external resource loading
