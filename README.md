# DataCite Linked Data Schema (JSON-LD)

This repository contains JSON-LD resources that describe parts of the DataCite metadata schema (currently staged at version `4.7`) as linked data.

If you are new to this topic:

- JSON-LD is a JSON-based format for representing linked data (RDF-style identifiers and relationships).
- This repo is primarily a collection of schema artifacts, vocabularies, contexts, manifests, and example transformation outputs.

## What This Repository Is For

This repository organizes DataCite metadata concepts into resolvable JSON-LD files:

- `class/` defines major entities such as `Resource`, `Creator`, and `Title`
- `property/` defines metadata properties such as `identifier`, `creatorName`, and `publicationYear`
- `vocab/` defines controlled vocabularies (enumerated terms) used by DataCite fields (for example `resourceTypeGeneral`, `relationType`, `nameType`)
- `context/` contains JSON-LD contexts used to map compact keys to IRIs
- `manifest/` provides a versioned inventory of classes, properties, and vocabulary schemes/terms
- `dist/` contains integrated distribution artifacts that bundle the schema as a single JSON-LD graph plus alternate RDF serializations
- `Input files/` contains example XML, transformed JSON outputs, validation helpers, and notes used during transformation experiments

## Release Upgrade Guides

If you need to handle a new DataCite schema release, start here:

- [DATACITE-RELEASE-RUNBOOK.md](/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/DATACITE-RELEASE-RUNBOOK.md): step-by-step guide for detecting, reviewing, applying, and merging a new DataCite release
- [UPGRADING-4.6-TO-4.7.md](/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/UPGRADING-4.6-TO-4.7.md): detailed worked example of the `4.6 -> 4.7` upgrade

## Repository Layout (Plain-English Guide)

### `class/`

Each file describes a DataCite entity as a JSON-LD/RDF class.

Example:

- `class/Resource.jsonld` defines the class IRI for a citable resource

Typical structure:

- `@id`: stable IRI of the class
- `@type`: usually `rdfs:Class`
- `rdfs:label`: human-readable name
- `rdfs:comment`: short description

### `property/`

Each file describes one DataCite property as a JSON-LD/RDF property.

Example:

- `property/identifier.jsonld` describes the `identifier` field used in DataCite metadata


### `vocab/`

This folder contains controlled terms used by DataCite (enumerations).

Examples:

- `vocab/resourceTypeGeneral/` for values like `Dataset`, `Software`, `Text`
- `vocab/relationType/` for values like `Cites`, `IsPartOf`, `References`
- `vocab/nameType/` for values like `Personal`, `Organizational`

There are usually two kinds of files in each vocabulary folder:

- a vocabulary scheme file (for example `resourceTypeGeneral.jsonld`)
- individual term files (for example `Dataset.jsonld`)

### `context/`

Contains JSON-LD contexts that define how compact JSON keys map to linked-data identifiers.

Important files:

- `context/fullcontext.jsonld`: a large mapping used to interpret DataCite-like JSON as linked data
- `context/runner.jsonld`: example JSON instance using the context
- `context/runner.nq`: RDF/N-Quads output derived from the example
- `context/runner.err`: transformation/processing notes or errors from a run

### `manifest/`

- `manifest/datacite-4.7.json` is the current staged versioned index of linked-data resources
- `manifest/datacite-4.6.json` remains as a frozen previous release snapshot
- `manifest/datacite-current.json` is the canonical pointer to the current default manifest/distribution targets
- `manifest/release-matrix-4.6-4.7.json` captures the schema-level change matrix between these two versions

This is a useful entry point if you want to programmatically discover what is defined for a given schema version.

Release-import automation:

- `node scripts/detect-datacite-release.js` builds a review plan for the next official DataCite `4.x` release or for an explicitly requested version
- `node scripts/apply-datacite-release-plan.js --plan reports/release-import-plan-<version>.json` applies approved plan items and regenerates outputs

The `Detect DataCite Release` GitHub workflow can now commit the generated plan files back to the selected branch, so the JSON plan can be reviewed and edited directly on GitHub before running the apply workflow.

### `dist/`

- `dist/datacite-4.7.jsonld` is the integrated JSON-LD bundle for the current staged schema version
- `dist/datacite-4.7.ttl` is the Turtle serialization of that bundle
- `dist/datacite-4.7.rdf` is the RDF/XML serialization of that bundle
- `dist/datacite-current.jsonld` is the canonical pointer to the current default distribution targets

These files are generated from the manifest-backed source files by `node scripts/build-distribution.js --version 4.7`.

Release snapshot automation:

- `node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03` creates/updates the versioned manifest, distribution bundle, current pointers, and section index pages.
- `node scripts/update-current-pointers.js --version 4.7` refreshes only canonical current pointers.

### `Input files/`

This folder contains working materials and examples used to test conversions and round-tripping:

- DataCite XML examples and XSD files
- XML-shaped JSON examples
- roundtrip XML outputs
- TTL examples
- validation helper script (`validate_xml.rb`)
- notes documenting conversion steps (`codes&steps.md`)

## What Is “Linked Data” Here?

In this repo, linked data mainly means:

- metadata concepts have stable IRIs (web identifiers)
- JSON documents include context mappings (`@context`)
- terms can be interpreted as RDF classes, properties, and controlled concepts

This allows metadata fields like `identifier`, `creator`, or `resourceTypeGeneral` to be described in a machine-readable, interoperable way.

## File Counts (Current Repository Snapshot)

- `class/`: 21 JSON-LD files
- `property/`: 79 JSON-LD files
- `vocab/`: 174 JSON-LD files
- `context/`: 2 JSON-LD files
- `manifest/`: 4 JSON files (`datacite-4.6.json`, `datacite-4.7.json`, `datacite-current.json`, `release-matrix-4.6-4.7.json`)
- `dist/`: 7 distribution/pointer files (`.jsonld`, `.ttl`, `.rdf`)

## Example: What a Vocabulary Term File Looks Like

An individual vocabulary term (for example `vocab/resourceTypeGeneral/Dataset.jsonld`) includes:

- a stable term IRI
- label (`prefLabel`)
- definition
- scheme membership (`inScheme`)
- optional notes/examples/mappings (`scopeNote`, `example`, `closeMatch`)

## Transformation Notes (XML, JSON, and Purpose)

This repo also includes notes and example artifacts for different transformation approaches from DataCite XML.

Two approaches appear in the existing notes:

1. `XML -> Bolognese JSON` (semantic normalization)
2. `XML -> xml-js JSON` (XML-shaped JSON for structural fidelity / round-trip testing)

The key difference is whether you want semantic convenience or exact XML structure preservation.

### Transformation Purpose Table

| Transformation | Purpose | Reversible | XML fidelity |
| ----- | ----- | ----- | ----- |
| XML -> bolognese JSON | Semantic normalization | ❌ No | ❌ No |
| XML -> xml-js JSON | Structural preservation | ✅ Yes | ✅ Yes |

## When To Use Which Representation

- Use DataCite/Bolognese-style JSON when you want a cleaner application-facing representation for APIs or processing pipelines
- Use XML-shaped JSON when you need to preserve XML attributes/wrappers and support round-trip conversion back to equivalent XML
- Use the JSON-LD files in this repo when you need schema definitions, vocabulary IRIs, and semantic mappings

## Important Context for Newcomers

- DataCite XML and DataCite JSON are not identical representations; they serve different goals
- “Valid XML” and “semantically equivalent JSON” are separate concerns
- JSON-LD contexts do not automatically validate DataCite business rules; they define interpretation/mapping
- Many IRIs in this repo use the `schema.stage.datacite.org` namespace, which indicates a staging environment namespace in the current artifacts

## Suggested Starting Points

If you are exploring this repo for the first time:

1. Open `dist/datacite-current.jsonld` for the canonical pointer, or `dist/datacite-4.7.jsonld` for the current integrated bundle.
2. Read `manifest/datacite-current.json` for current-version pointers, or `manifest/datacite-4.7.json` for the current full inventory.
3. Open `context/fullcontext.jsonld` to understand how DataCite-like JSON keys are mapped.
4. Compare one file each from `class/`, `property/`, and `vocab/` to see the modeling pattern.
5. Review `Input files/codes&steps.md` and the example files if you are evaluating XML <-> JSON round-tripping.

## Notes
- Some files in `Input files/` are experimental outputs used for validation and comparison, not canonical schema definitions.
