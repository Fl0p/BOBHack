# browser extension

## overview

BOBHack includes a browser extension for enhanced web interaction and form automation capabilities.

## structure

The extension is located in the `extension/` directory with the following architecture:

```
extension/
├── manifest.json              # Extension manifest (v3)
├── contentScript.js           # Main content script entry point
├── background/                # Background service scripts
│   ├── domPayload.js         # DOM payload handling
│   └── fieldExtractor.js     # Form field extraction logic
└── content/                   # Content script modules
    ├── cssPathBuilder.js      # CSS selector generation
    ├── domSnapshotCollector.js # DOM snapshot collection
    ├── elementValueSetter.js  # Element value manipulation
    ├── fieldValueApplier.js   # Form field value application
    ├── labelResolver.js       # Field label resolution
    └── messageRouter.js       # Message routing between scripts
```

## architecture

### modular design

The extension uses a namespace-based architecture for better dependency management:
- Content scripts organized into separate modules
- Background scripts handle DOM processing
- Message routing for inter-script communication

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

**messageRouter.js** (extension/content/messageRouter.js)
- Routes messages between content scripts and background
- Provides unified communication interface

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

### refactoring (commit b015482)
- Reorganized content scripts into namespace-based modules
- Improved dependency management
- Better code organization and maintainability

### enhancements (commit 10fa2c7)
- Updated extension name and description
- Enhanced field extraction logic
- Improved DOM payload handling

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
