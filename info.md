# DataCite Linked Data Repository Guide

This document explains what is in this repository right now, what each major folder is for, what is source material versus generated output, and how the versioned `4.6` and `4.7` artifacts fit together.

It is written for a beginner. You do not need previous linked-data experience to use it.

## Short version

This repository publishes parts of the DataCite metadata schema as linked data.

In plain English, that means:

- DataCite concepts such as `Resource`, `Creator`, and `identifier` are given stable web identifiers.
- controlled values such as `Dataset`, `DOI`, and `Cites` are modeled as vocabulary terms
- JSON-LD contexts explain how compact JSON keys map to those linked-data identifiers
- manifests list the versioned schema inventory
- generated distribution files package the whole schema as reusable bundles

The current staged version in this repository is `4.7`.

This repository also keeps the previous `4.6` release snapshot and exposes "current" pointer files that resolve to the latest staged version.

## What is in the repository now

As of the current repository contents:

- `class/` contains `21` JSON-LD class files
- `property/` contains `79` JSON-LD property files
- `vocab/` contains `175` JSON-LD files in total
- `context/` contains `2` JSON-LD files
- `manifest/` contains `4` JSON files
- `dist/` contains `12` non-HTML files

Those numbers mix together both source files and generated release artifacts, so it helps to split them further.

### Current versioned schema counts

The `4.7` manifest currently describes:

- `21` classes
- `79` properties
- `11` vocabularies
- `152` vocabulary term files
- `13` context files in the versioned manifest inventory

The older `4.6` manifest describes:

- `21` classes
- `78` properties
- `11` vocabularies
- `147` vocabulary term files
- `13` context files in the versioned manifest inventory

### What changed from `4.6` to `4.7`

The repository includes an explicit change summary in `manifest/release-matrix-4.6-4.7.json`.

The `4.7` release added:

- `relationTypeInformation` as a property
- `Poster` and `Presentation` in `resourceTypeGeneral`
- `RAiD` and `SWHID` in `relatedIdentifierType`
- `Other` in `relationType`

That is why the `4.7` manifest has:

- `1` more property than `4.6`
- `5` more vocabulary terms than `4.6`
- `264` graph nodes in the `4.7` bundle instead of `258`

## The most important idea: this repo is versioned now

This repository is no longer just "the DataCite linked-data schema."

It is now a small versioned release system with:

- frozen version-specific manifests and bundles
- a current-version pointer
- moving alias files for the latest full distribution
- release automation scripts and release documentation

That is the biggest structural change compared with the older `4.6`-only shape.

## How to think about the versions

There are now three different ways the repository exposes schema data.

### 1. Frozen versioned files

These are the release snapshots:

- `manifest/datacite-4.6.json`
- `manifest/datacite-4.7.json`
- `dist/datacite-4.6.jsonld`
- `dist/datacite-4.6.ttl`
- `dist/datacite-4.6.rdf`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`

These files are what you use when you need a specific schema version and you do not want moving targets.

### 2. Current-version pointers

These are the files that say which version is currently considered the default:

- `manifest/datacite-current.json`
- `dist/datacite-current.jsonld`

These do not contain the full schema bundle.

Instead:

- `manifest/datacite-current.json` points to the current manifest and distribution links
- `dist/datacite-current.jsonld` is a one-node JSON-LD pointer document

Important detail:

`dist/datacite-current.jsonld` is not a full bundle. It currently has only `1` graph node and acts as a pointer to the `4.7` bundle.

### 3. Moving latest aliases

These are convenience copies of the latest full release artifacts:

- `dist/datacite.jsonld`
- `dist/datacite.ttl`
- `dist/datacite.rdf`

Right now they point to the current `4.7` release outputs.

If `4.8` is staged later and current pointers are updated, these alias files will move.

## Repository layout, folder by folder

### `class/`

This folder contains the main classes in the semantic model.

Examples:

- `class/Resource.jsonld`
- `class/Creator.jsonld`
- `class/Contributor.jsonld`
- `class/Title.jsonld`
- `class/Publisher.jsonld`

Each class file is lightweight. A typical file contains:

- `@id`: the class IRI
- `@type`: usually `rdfs:Class`
- `rdfs:label`: a human-readable label
- `rdfs:comment`: a short plain-English description

These files identify the major kinds of things the schema talks about.

They are descriptive. They are not a full validation layer.

### `property/`

This folder contains one JSON-LD file per DataCite property.

Examples:

- `property/identifier.jsonld`
- `property/creator.jsonld`
- `property/creatorName.jsonld`
- `property/publicationYear.jsonld`
- `property/relationTypeInformation.jsonld`

Each property file usually contains:

- `@id`: the property IRI
- `@type`: usually `rdf:Property`
- `rdfs:label`: the field name
- `rdfs:comment`: a short description

The important current change here is:

- `property/relationTypeInformation.jsonld` exists in `4.7` and did not exist in `4.6`

Like the class files, these property files are mostly descriptive at the moment. They do not yet encode a full domain/range or SHACL-style constraint system.

### `vocab/`

This folder contains controlled vocabularies and their term files.

This is one of the most important parts of the repository because many DataCite fields rely on known controlled values.

The repository currently contains these vocabulary families in the `4.7` manifest:

| Vocabulary | What it controls | Current term count |
| --- | --- | ---: |
| `contributorType` | kinds of contributors | 22 |
| `dateType` | kinds of dates | 12 |
| `descriptionType` | kinds of descriptions | 6 |
| `funderIdentifierType` | kinds of funder IDs | 5 |
| `identifierType` | kinds of primary identifiers | 1 |
| `nameType` | kinds of names | 2 |
| `numberType` | kinds of numbers | 4 |
| `relatedIdentifierType` | kinds of related identifiers | 23 |
| `relationType` | kinds of relationships | 39 |
| `resourceTypeGeneral` | broad resource categories | 34 |
| `titleType` | kinds of titles | 4 |

Each vocabulary directory usually contains:

1. a scheme file  
   Example: `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`

2. a context file  
   Example: `vocab/resourceTypeGeneral/context.jsonld`

3. individual term files  
   Example: `vocab/resourceTypeGeneral/Dataset.jsonld`

#### Vocabulary scheme files

Scheme files represent the whole vocabulary as a `ConceptScheme`.

They usually contain:

- `title`
- `identifier`
- `created`
- `hasTopConcept`

#### Vocabulary term files

Term files represent one allowed value as a `Concept`.

They usually contain:

- `id`
- `type`
- `prefLabel`
- `notation`
- `definition`
- `inScheme`
- `topConceptOf`
- sometimes `scopeNote`, `example`, and `closeMatch`

#### Why SKOS is used

The vocabularies use SKOS because SKOS is a standard RDF vocabulary for controlled terms and concept schemes.

That makes it a good fit for:

- enumerated values
- human-readable labels
- definitions
- scheme membership

### `context/`

This folder contains the main JSON-LD interpretation files and example instance material.

Important files:

- `context/fullcontext.jsonld`
- `context/runner.jsonld`
- `context/runner.nq`
- `context/runner.err`

#### `context/fullcontext.jsonld`

This is the main JSON-LD context used to interpret compact DataCite-like JSON.

It maps keys such as:

- `identifier`
- `creator`
- `title`
- `resourceTypeGeneral`
- `relationTypeInformation`

to their linked-data property IRIs.

It also indicates whether a value should be treated as:

- a string
- an IRI
- a controlled vocabulary term
- or a set of values

This file is one of the core semantic source files in the repository.

#### `context/runner.jsonld`

This file is a worked example instance document that uses `context/fullcontext.jsonld`.

It shows what actual DataCite-like metadata looks like when written in the compact JSON-LD style used by the repository.

It is useful for learning, but it is not part of the versioned manifest inventory.

#### `context/runner.nq` and `context/runner.err`

These are experiment outputs related to processing the runner example.

Right now:

- `context/runner.nq` contains an error trace from a failed attempt to resolve `./fullcontext.jsonld`
- `context/runner.err` is empty

So do not treat `context/runner.nq` as a trusted final RDF export in its current state.

### `manifest/`

This folder contains the machine-readable inventory files for released schema versions and the current pointer state.

Current files:

- `manifest/datacite-4.6.json`
- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `manifest/release-matrix-4.6-4.7.json`

What each file does:

- `datacite-4.6.json`: frozen schema inventory for `4.6`
- `datacite-4.7.json`: frozen schema inventory for `4.7`
- `datacite-current.json`: pointer file that says `4.7` is current and lists current links
- `release-matrix-4.6-4.7.json`: human-readable and machine-readable summary of the upgrade delta

The versioned manifests are the main machine-readable release inventories.

They tell you:

- the namespace
- the version
- which context files are part of the release inventory
- which class files are in the release
- which property files are in the release
- which vocabulary schemes and terms are in the release

### `dist/`

This folder contains generated distribution outputs and distribution pointers.

The current non-HTML files are:

- `dist/datacite-4.6.jsonld`
- `dist/datacite-4.6.ttl`
- `dist/datacite-4.6.rdf`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`
- `dist/datacite-current.jsonld`
- `dist/datacite.jsonld`
- `dist/datacite.ttl`
- `dist/datacite.rdf`
- `dist/datacite-4.7-owl-properties.ttl`
- `dist/datacite-4.7-owl-properties.properties`

The most important ones are the versioned `.jsonld`, `.ttl`, and `.rdf` bundles plus the current pointer and moving alias files.

#### The main `4.7` bundle

The current staged release bundle is:

- `dist/datacite-4.7.jsonld`

This is the integrated JSON-LD graph for the `4.7` release.

It currently contains `264` graph nodes:

- `1` generated ontology node
- `21` class nodes
- `79` property nodes
- `11` vocabulary scheme nodes
- `152` vocabulary term nodes

The matching serializations are:

- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`

#### Current pointer vs moving aliases

These are not the same thing:

- `dist/datacite-current.jsonld` is a pointer document
- `dist/datacite.jsonld` is a full copy of the latest versioned bundle

That distinction matters because a beginner might reasonably expect both to contain the full schema graph. Only the alias file does.

#### The extra OWL export files

There are also two extra `4.7` files:

- `dist/datacite-4.7-owl-properties.ttl`
- `dist/datacite-4.7-owl-properties.properties`

These appear to come from a separate OWL-oriented export step rather than from the main `build-distribution.js` flow.

The `.ttl` file contains OWL object/datatype property declarations and extra domain/range-style material. The `.properties` file is a Java-style properties file with JDBC placeholders.

Treat these as supplementary outputs, not as the primary distribution format for the repository.

### `scripts/`

This folder now contains both maintenance scripts and release-management scripts.

The main ones are:

- `scripts/manifest-sync.js`
- `scripts/build-distribution.js`
- `scripts/generate-index-pages.js`
- `scripts/update-current-pointers.js`
- `scripts/release-snapshot.js`
- `scripts/update-root-index.js`
- `scripts/detect-datacite-release.js`
- `scripts/apply-datacite-release-plan.js`

There is also a `scripts/lib/` directory with shared versioning and release-import logic.

### `Input files/`

This folder contains XML, JSON, RDF, XSD, and notes used during transformation and round-trip experiments.

Important files include:

- `Input files/datacite-example-full-v4.xml`
- `Input files/XML-Shaped-JSON.json`
- `Input files/roundtrip.xml`
- `Input files/original.c14n.xml`
- `Input files/roundtrip.c14n.xml`
- `Input files/metadata-4.6.xsd`
- `Input files/runner.ttl`
- `Input files/runner-pretty.ttl`
- `Input files/codes&steps.md`
- `Input files/validate_xml.rb`

These are useful for understanding XML conversion and round-tripping, but they are not the main versioned linked-data source layer.

### Documentation files

There are also important documentation files at the repository root:

- `README.md`
- `DATACITE-RELEASE-RUNBOOK.md`
- `UPGRADING-4.6-TO-4.7.md`
- `CONTRIBUTING.md`

These explain:

- what the repository is for
- how the release-import flow works
- what changed from `4.6` to `4.7`
- how contributors should work with the repo

## The semantic model in plain English

This is the conceptual core of the repository.

The model has four beginner-friendly layers.

### 1. Classes

Classes describe the kinds of things the schema talks about.

Examples:

- `Resource`
- `Creator`
- `Contributor`
- `Title`
- `Publisher`
- `Identifier`
- `RelatedIdentifier`
- `RelatedItem`
- `FundingReference`

These are the "things" in the model.

### 2. Properties

Properties describe fields and relationships.

Examples:

- `identifier`
- `creator`
- `creatorName`
- `publicationYear`
- `resourceTypeGeneral`
- `relationType`
- `relationTypeInformation`

Some properties behave like plain text fields.

Some properties point to nested objects.

Some properties point to controlled vocabulary values.

### 3. Controlled terms

Controlled terms are the allowed values used by some properties.

Examples:

- `DOI` in `identifierType`
- `Dataset`, `Poster`, and `Presentation` in `resourceTypeGeneral`
- `RAiD` and `SWHID` in `relatedIdentifierType`
- `Cites` and `Other` in `relationType`

Instead of storing those as anonymous strings, the repository gives each one a stable linked-data identifier.

### 4. Context rules

The context layer tells JSON-LD how to interpret compact JSON keys and values.

This is how a compact JSON record can still carry machine-readable RDF meaning.

## What the semantic model is good at

The current model is strong at:

- naming DataCite concepts consistently
- publishing stable IRIs
- packaging controlled vocabularies cleanly with SKOS
- mapping compact JSON keys to linked-data identifiers
- producing reusable distribution bundles
- keeping explicit versioned release snapshots

## What the semantic model does not do by itself

The repository is not yet a full validation system.

It does not, by itself, fully encode:

- all DataCite business rules
- full cardinality constraints
- complete domain/range logic across every property
- SHACL validation rules
- end-to-end DOI registration behavior

So this repo is best understood as:

- a semantic publication layer
- a release packaging layer

not as:

- the whole validation or registration system

## The distribution build, explained plainly

The main bundle is generated by:

- `node scripts/build-distribution.js --version 4.7`

That script:

1. reads the selected versioned manifest
2. loads all classes listed in it
3. loads all properties listed in it
4. loads all vocabulary schemes and terms listed in it
5. normalizes them into one JSON-LD graph
6. adds one ontology header node
7. writes the versioned `.jsonld` bundle
8. tries to write matching Turtle and RDF/XML files

Important detail:

The build script does not bundle `context/fullcontext.jsonld` into the main graph. It bundles classes, properties, vocabulary schemes, and vocabulary terms.

The output uses a generated bundle context instead.

## Why the RDF bundle uses `dcterms`

The versioned bundle context maps generic metadata keys like:

- `title`
- `identifier`
- `created`
- `modified`
- `license`
- `source`

to Dublin Core Terms.

That is why the RDF/XML distribution contains:

- `dcterms:title`
- `dcterms:identifier`
- `dcterms:created`
- `dcterms:license`
- `dcterms:source`

Those `dcterms` properties describe:

- the generated ontology bundle
- the vocabulary scheme records

They do not replace the DataCite field IRIs used in `context/fullcontext.jsonld`.

## How the current pointer files are built

The current pointer state is refreshed by:

- `node scripts/update-current-pointers.js --version 4.7`

That script:

1. writes `manifest/datacite-current.json`
2. writes `dist/datacite-current.jsonld`
3. copies the latest versioned bundle to the moving alias files:
   `dist/datacite.jsonld`, `dist/datacite.ttl`, and `dist/datacite.rdf`

That is why the repo now has both pointer files and alias copies.

## The release snapshot script

The highest-level maintenance script is:

- `node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03`

That script chains together the normal release-output steps:

1. ensure the versioned manifest exists
2. sync and validate it
3. build the versioned distribution
4. update current pointers and moving aliases
5. regenerate section index pages
6. refresh the root index

This is the shortest practical explanation of how a new version snapshot is produced.

## Release-management automation

The repository now also includes scripts for detecting and applying new DataCite releases.

Main scripts:

- `scripts/detect-datacite-release.js`
- `scripts/apply-datacite-release-plan.js`

Supporting documentation:

- `DATACITE-RELEASE-RUNBOOK.md`
- `UPGRADING-4.6-TO-4.7.md`

In plain English, this means the repository is prepared not only to hold schema files, but also to help detect future DataCite `4.x` changes and stage them in a controlled way.

## Source files vs generated files vs experimental files

This distinction matters a lot.

### Main semantic source files

Treat these as the core hand-maintained semantic definitions:

- `class/*.jsonld`
- `property/*.jsonld`
- `vocab/**/**/*.jsonld`
- `context/fullcontext.jsonld`

### Example and experiment files

Treat these as learning or transformation material:

- `context/runner.jsonld`
- `context/runner.nq`
- `context/runner.err`
- most of `Input files/`

### Generated release artifacts

Treat these as outputs:

- `manifest/datacite-4.6.json`
- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `manifest/release-matrix-4.6-4.7.json`
- `dist/datacite-4.6.*`
- `dist/datacite-4.7.*`
- `dist/datacite-current.jsonld`
- `dist/datacite.*`
- `class/index.html`
- `property/index.html`
- `vocab/index.html`
- `context/index.html`
- `dist/index.html`
- `manifest/index.html`
- `index.html`

### Supplementary OWL-oriented output

Treat these separately from the main distribution flow:

- `dist/datacite-4.7-owl-properties.ttl`
- `dist/datacite-4.7-owl-properties.properties`

## The XML and round-trip experiment layer

The repository still contains the earlier XML conversion work.

The key guide for that material is:

- `Input files/codes&steps.md`

That experiment workflow does this:

1. start from a DataCite XML example
2. convert XML into XML-shaped JSON
3. convert JSON back into XML
4. canonicalize both XML files
5. compare them
6. validate the result against the XSD

This solves a different problem from the versioned linked-data manifests and distributions.

The linked-data side is about semantic publication.  
The XML experiment side is about structure preservation and round-tripping.

## Important caveats

### 1. The namespace is still a staging namespace

The repo uses:

- `https://schema.stage.datacite.org/linked-data/`

So treat these identifiers as current staged identifiers, not automatically as permanent production ones.

### 2. `context/runner.nq` is currently an error trace

At the moment, `context/runner.nq` contains a failed JSON-LD CLI error trace about resolving `./fullcontext.jsonld`.

So it is not a clean N-Quads export right now.

### 3. `manifest/datacite-current.json` is not the same shape as a versioned manifest

It is a pointer document with:

- `currentVersion`
- `updated`
- `links`
- `availableVersions`

It does not contain the full `classes`, `properties`, `context`, and `vocabularies` arrays of a versioned manifest.

### 4. `dist/datacite-current.jsonld` is not the same shape as `dist/datacite-4.7.jsonld`

It is a pointer ontology with one graph node, not a full schema bundle.

### 5. The OWL export files are extra artifacts

The main distribution flow is centered on:

- `.jsonld`
- `.ttl`
- `.rdf`

The `-owl-properties` files are additional outputs and should be treated separately.

## The easiest reading order for a beginner

If you are trying to understand this repository from scratch, use this order:

1. Read this `info.md`.
2. Read `README.md`.
3. Open `manifest/datacite-current.json` to see what is currently staged.
4. Open `manifest/datacite-4.7.json` to see the full current release inventory.
5. Open `dist/datacite.jsonld` if you want the latest full bundle, or `dist/datacite-4.7.jsonld` if you want the fixed versioned bundle.
6. Open `context/fullcontext.jsonld` to see how compact keys are interpreted.
7. Compare one file from each of `class/`, `property/`, and `vocab/`.
8. Open `UPGRADING-4.6-TO-4.7.md` if you want to understand what changed in the current release.
9. Open `DATACITE-RELEASE-RUNBOOK.md` if you want to understand how future upgrades are supposed to work.
10. Open `Input files/codes&steps.md` if you want the older XML experiment workflow.

## One simple mental map

If you want one short mental model, use this:

- `class/` says what kinds of things exist
- `property/` says what fields and links describe them
- `vocab/` says which controlled values are allowed
- `context/` says how compact JSON maps to linked data
- `manifest/` records versioned release inventories and current pointers
- `dist/` packages the released schema bundles and aliases
- `scripts/` keeps the versioned outputs synchronized
- `Input files/` records XML conversion and round-trip experiments

That is the current repository in one picture.
