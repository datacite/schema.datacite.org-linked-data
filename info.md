# DataCite Linked Data Repository Guide

This file explains this repository in plain English for someone who is new to linked data, new to JSON-LD, and new to the DataCite metadata world.

It is intentionally detailed. The goal is that you should be able to open this file first, then explore the rest of the repository without feeling lost.

## Short version

This repository turns pieces of the DataCite metadata schema (version `4.6`) into linked-data files.

In simple terms, that means:

- important DataCite concepts are given stable web identifiers
- those concepts are described in machine-readable JSON-LD files
- controlled lists of allowed values are modeled as vocabularies
- a manifest lists all of the important files
- a generated distribution bundles the whole model into one file for easier reuse

If you only remember one sentence, remember this:

This repository is a linked-data description of the DataCite schema, not a DOI registration service and not a complete validation engine.

## What exists in this repository right now

As the repository currently stands, it contains:

- a versioned linked-data namespace rooted at `https://schema.stage.datacite.org/linked-data/`
- `21` class definition files in `class/`
- `78` property definition files in `property/`
- `11` controlled vocabularies in `vocab/`
- `147` individual controlled vocabulary term files across those vocabularies
- `14` context-related JSON-LD files listed in the manifest
- `1` manifest file in `manifest/`
- `3` generated distribution files in `dist/`
- maintenance scripts in `scripts/`
- experimental XML/JSON conversion and validation materials in `Input files/`
- browser-friendly HTML index pages for people who want to browse the files on the web

In other words, the repository already does more than store isolated JSON files. It contains:

1. source schema definitions
2. source vocabulary definitions
3. context files that explain how to read compact JSON as linked data
4. an inventory file that ties everything together
5. generated bundle files for downstream use
6. generated HTML pages for human browsing
7. experiment files used to test XML-to-JSON and round-trip ideas

## What "linked data" means here

If you have never worked with linked data before, the phrase can sound more complicated than it really is.

Here is the simplest way to think about it:

- ordinary JSON uses keys like `"identifier"` or `"creatorName"`
- linked data gives those keys precise meanings by connecting them to full web identifiers
- those web identifiers are usually URLs or IRIs that act as globally unique names

So instead of saying only:

- `"identifier"`

linked data says:

- this key means the property identified by `https://schema.stage.datacite.org/linked-data/property/identifier`

That is useful because different systems can agree on the meaning of the same field, even if they were built by different teams.

### The basic building blocks

There are four beginner-level ideas that explain almost everything in this repository:

1. **Class**: a type of thing  
   Example: a `Resource`, `Creator`, or `Publisher`

2. **Property**: a field or relationship  
   Example: `identifier`, `creatorName`, or `publicationYear`

3. **Vocabulary term**: one allowed value from a controlled list  
   Example: `Dataset`, `DOI`, `Personal`, `Cites`

4. **Context**: a translation map that tells JSON-LD how to interpret short keys  
   Example: it can map `"identifier"` to the full property IRI

If you know those four ideas, the rest of the repository becomes much easier to follow.

### Why JSON-LD is used

JSON-LD is useful here because it lets the files stay readable as JSON while still carrying RDF-style meaning.

That means the same data can be:

- easy for developers to inspect as JSON
- precise enough for linked-data tools to understand
- convertible into RDF serializations like Turtle or RDF/XML

## What this project is actually modeling

This project is modeling the **meaning of DataCite metadata fields**, not just their spelling.

DataCite metadata includes fields such as:

- identifier
- creators
- titles
- publisher
- publication year
- resource type
- related identifiers
- contributors
- descriptions
- rights
- geolocations

This repository gives those fields a linked-data shape.

That means it defines:

- what major entities exist
- what properties can describe those entities
- what controlled values some properties can use
- how compact JSON keys map to those linked-data identifiers

## What we have built in practical terms

Looking at the current files, the repository now supports these main jobs:

1. It defines DataCite concepts as standalone JSON-LD resources.
2. It organizes DataCite controlled values as SKOS vocabularies.
3. It provides a reusable JSON-LD context for interpreting DataCite-like JSON.
4. It keeps a machine-readable manifest of the schema inventory.
5. It generates an integrated distribution bundle in multiple RDF-friendly formats.
6. It generates section index pages so humans can browse the namespace in a browser.
7. It keeps experiment files that document XML-to-JSON and round-trip testing.

That is the most complete plain-English summary of "what we have done" based on the current repository contents.

## Repository structure, folder by folder

### `class/`

This folder contains the main entity types in the model.

Each file is one class definition. Examples include:

- `class/Resource.jsonld`
- `class/Creator.jsonld`
- `class/Title.jsonld`
- `class/Publisher.jsonld`

These files are very lightweight on purpose. A typical class file contains:

- `@id`: the permanent identifier for the class
- `@type`: usually `rdfs:Class`
- `rdfs:label`: a human-readable name
- `rdfs:comment`: a plain-language description

For example, `class/Resource.jsonld` says that `Resource` is a class and gives it a short label and comment.

Important detail:

The class files currently describe the existence and meaning of the class, but they do **not** define rich logical constraints such as inheritance trees, cardinality rules, or formal validation rules.

So think of `class/` as:

- a semantic naming layer
- a documentation layer

not as:

- a full ontology with deep logic

### `property/`

This folder contains field definitions.

Each file is one property. Examples include:

- `property/identifier.jsonld`
- `property/creator.jsonld`
- `property/creatorName.jsonld`
- `property/publicationYear.jsonld`

Each property file is also lightweight. A typical file contains:

- `@id`: the property IRI
- `@type`: usually `rdf:Property`
- `rdfs:label`: the field name
- `rdfs:comment`: a beginner-readable description

For example, `property/identifier.jsonld` explains the `identifier` property as the unique string that identifies a resource.

Important detail:

The property files currently identify and describe properties, but they do **not** currently declare things like:

- `rdfs:domain`
- `rdfs:range`
- `owl:ObjectProperty`
- `owl:DatatypeProperty`

That means the current property layer is descriptive rather than fully constrained.

This is a key point for beginners:

The repository tells you what a property means, but it is not trying to be a strict rule engine by itself.

### `vocab/`

This folder contains controlled vocabularies.

Controlled vocabularies are lists of allowed values. They matter because some metadata fields should not accept arbitrary text.

For example:

- `resourceTypeGeneral` should use terms like `Dataset` or `Software`
- `relationType` should use terms like `Cites` or `IsPartOf`
- `nameType` should use terms like `Personal` or `Organizational`

The current repository contains these vocabulary families:

| Vocabulary | What it controls | Term count |
| --- | --- | ---: |
| `contributorType` | kinds of contributors | 22 |
| `dateType` | kinds of dates | 12 |
| `descriptionType` | kinds of descriptions | 6 |
| `funderIdentifierType` | kinds of funder IDs | 5 |
| `identifierType` | kinds of primary identifiers | 1 |
| `nameType` | kinds of names | 2 |
| `numberType` | kinds of numbers | 4 |
| `relatedIdentifierType` | kinds of related IDs | 21 |
| `relationType` | kinds of relationships | 38 |
| `resourceTypeGeneral` | broad resource categories | 32 |
| `titleType` | kinds of titles | 4 |

Each vocabulary folder usually contains three kinds of files:

1. a scheme file  
   Example: `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`

2. a context file  
   Example: `vocab/resourceTypeGeneral/context.jsonld`

3. individual term files  
   Example: `vocab/resourceTypeGeneral/Dataset.jsonld`

#### Vocabulary scheme files

The scheme file represents the whole vocabulary as a `ConceptScheme`.

For example, `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`:

- identifies the scheme
- gives it a title
- gives it a short identifier
- records a creation date
- lists its top concepts using `hasTopConcept`

That means the scheme file is the "container" for the vocabulary.

#### Vocabulary term files

Each term file represents one allowed value as a `Concept`.

For example, `vocab/resourceTypeGeneral/Dataset.jsonld` contains:

- `id`: the term IRI
- `type`: `Concept`
- `prefLabel`: the preferred human name
- `notation`: the code-like value
- `definition`: the meaning
- `inScheme`: which vocabulary it belongs to
- `topConceptOf`: the top-level scheme it belongs to
- optional helpful extras like `scopeNote`, `example`, and `closeMatch`

That means a term file is not just a string. It is a small semantic record about the string.

#### Why SKOS is used

The vocabularies use SKOS (Simple Knowledge Organization System).

For a beginner, that means:

- SKOS is a standard way to model term lists, taxonomies, and concept schemes
- it is a good fit for controlled values
- it gives useful fields like label, definition, and membership in a scheme

This is why the vocabulary side of the repository is more structured than the simple class and property files.

### `context/`

This folder is about interpretation.

The most important file here is:

- `context/fullcontext.jsonld`

This file tells JSON-LD how to interpret compact DataCite-style keys.

For example, it maps short names like:

- `identifier`
- `creator`
- `title`
- `resourceTypeGeneral`

to their full linked-data identifiers.

It also tells JSON-LD what kind of value a field is. For example:

- some fields are plain strings
- some fields are IRIs
- some fields should be interpreted as vocabulary terms
- some fields are sets rather than single values

#### A beginner-friendly way to think about `fullcontext.jsonld`

You can think of `context/fullcontext.jsonld` as a bilingual dictionary:

- on one side is compact JSON that looks familiar to developers
- on the other side is the full linked-data meaning

Without a context, `"identifierType": "DOI"` is just text.

With the context, it can mean:

- the `identifierType` property
- whose value should be interpreted from the `identifierType` vocabulary
- where `"DOI"` resolves to the linked-data term for DOI

#### The special `attrs` and `value` pattern

One of the most important design choices in this repository is the use of:

- `attrs`
- `value`

This mirrors the XML-shaped JSON approach used in the experiment files.

In plain English:

- `attrs` holds XML-like attributes
- `value` holds the text content of an element

So this JSON:

```json
"identifier": {
  "attrs": {
    "identifierType": "DOI"
  },
  "value": "10.82433/B09Z-4K37"
}
```

means the same idea as:

```xml
<identifier identifierType="DOI">10.82433/B09Z-4K37</identifier>
```

That is a very important bridge for beginners, because it explains how the project connects XML-shaped data and linked-data semantics.

#### `context/runner.jsonld`

This file is an example instance document that uses `fullcontext.jsonld`.

It is not just another context. It is an example of actual metadata written in the style the context expects.

It shows:

- a DOI
- creators
- titles
- a publisher
- a publication year
- subjects
- contributors

and many other DataCite fields.

This file is useful because it answers the practical question:

"What does a real JSON-LD record look like when it uses this model?"

#### Important detail about the manifest's `context` list

The manifest field is named `context`, but it includes more than pure context definitions.

It includes:

- actual context documents such as `context/fullcontext.jsonld`
- vocabulary context files
- and also the example instance file `context/runner.jsonld`

So when you see the word `context` in the manifest, read it as:

"context-related JSON-LD files"

not as:

"only files that are literally JSON-LD contexts"

### `manifest/`

This folder contains the machine-readable inventory of the repository.

The key file is:

- `manifest/datacite-4.6.json`

This file is extremely important because it is the source of truth for what belongs in the versioned schema set.

It tells you:

- the namespace
- the schema version
- which context-related files exist
- which class files exist
- which property files exist
- which vocabulary schemes exist
- which term files belong to each vocabulary

If a downstream tool wants to discover the whole repository programmatically, the manifest is the best starting point.

### `dist/`

This folder contains bundled distribution artifacts.

These are generated files, not hand-authored source definitions.

The current distribution files are:

- `dist/datacite-4.6.jsonld`
- `dist/datacite-4.6.ttl`
- `dist/datacite-4.6.rdf`

These are explained in detail later in this document because they are one of the most important outputs of the repository.

### `scripts/`

This folder contains the maintenance scripts that keep the repository synchronized.

The main scripts are:

- `scripts/manifest-sync.js`
- `scripts/build-distribution.js`
- `scripts/generate-index-pages.js`

These scripts are the operational backbone of the repository. They are how the source files become reliable generated outputs.

### `Input files/`

This folder contains experiments, examples, and validation materials related to XML and JSON transformation work.

It includes:

- example DataCite XML
- DataCite XSD files
- XML-shaped JSON
- round-trip XML outputs
- Turtle experiment outputs
- notes about conversion steps
- a validation helper script

These files are useful for learning and experimentation, but they are **not** the primary canonical schema definitions.

For canonical schema definitions, prefer:

- `class/`
- `property/`
- `vocab/`
- `context/`
- `manifest/`
- `dist/`

### HTML files

The repository also contains browser-facing HTML pages:

- the root `index.html`
- section pages such as `class/index.html`, `property/index.html`, `vocab/index.html`, `context/index.html`, `dist/index.html`, and `manifest/index.html`

These pages exist to make the namespace easier to browse in a web browser.

They are documentation and navigation aids.

They are not the canonical semantic source files.

## The semantic model in plain English

This is the most important conceptual section in the whole document.

The semantic model answers the question:

"What kinds of things does the repository say exist, and how do they relate to each other?"

### Level 1: Classes (the "things")

The class files describe the kinds of things the model talks about.

Examples:

- `Resource`
- `Creator`
- `Contributor`
- `Title`
- `Publisher`
- `Identifier`
- `RelatedIdentifier`
- `FundingReference`
- `GeoLocation`

These tell us the model is trying to talk about:

- a citable thing
- the people or organizations connected to it
- the names and identifiers attached to it
- supporting descriptive details

### Level 2: Properties (the "fields" and "links")

The property files describe the fields that carry information.

Examples:

- `identifier`
- `creator`
- `creatorName`
- `title`
- `publicationYear`
- `resourceTypeGeneral`
- `relationType`
- `rights`

Some properties hold simple text.

Examples:

- a publication year
- a free-text title
- a format string

Some properties point to identifiers or controlled values.

Examples:

- `identifierType`
- `nameType`
- `resourceTypeGeneral`
- `relationType`

Some properties connect one nested structure to another.

Examples:

- `creator`
- `contributor`
- `relatedIdentifier`
- `fundingReference`

### Level 3: Controlled terms (the "allowed values")

Some fields should use known values from a fixed or semi-fixed list.

For example:

- `resourceTypeGeneral` should point to a term like `Dataset`
- `nameType` should point to `Personal` or `Organizational`
- `relationType` should point to a relationship term like `Cites`

This is why the repository models those terms as separate linked-data resources.

Instead of just storing `"Dataset"` as an unstructured string, the model can point to:

- `https://schema.stage.datacite.org/linked-data/vocab/resourceTypeGeneral/Dataset`

That gives the value a stable identity and lets tools know exactly which concept is meant.

### Level 4: Context rules (the "how to read the JSON")

The context files explain how the JSON should be interpreted.

This is the layer that says things like:

- this key maps to this property IRI
- this value is an IRI
- this value comes from a controlled vocabulary
- this array should be treated as a set
- this `lang` value becomes a JSON-LD language tag

Without the context, the JSON is just structured text.

With the context, the JSON becomes linked data.

### A simple end-to-end example

Take this idea:

- a resource has an identifier
- the identifier value is `10.82433/B09Z-4K37`
- the identifier type is `DOI`

In this repository, that idea spans multiple layers:

1. The field name `identifier` is defined as a property in `property/identifier.jsonld`.
2. The type field `identifierType` is defined as a property in `property/identifierType.jsonld`.
3. The allowed value `DOI` is defined as a term in `vocab/identifierType/DOI.jsonld`.
4. The JSON-LD context says `identifierType` should be interpreted using the `identifierType` vocabulary.
5. The example file `context/runner.jsonld` shows how the value appears in instance data.

This is the core pattern used throughout the repository.

### What the model does well

The current model is strong at:

- naming things consistently
- giving important concepts stable identifiers
- documenting meanings in human-readable comments and definitions
- modeling controlled values cleanly with SKOS
- making compact JSON interpretable as linked data
- packaging the whole set into a reusable distribution

### What the model does not try to do yet

The current model is not a full formal constraint system.

In practical terms, it does not currently encode rich validation rules such as:

- exactly which class a property must belong to
- strict required/optional rules
- minimum and maximum cardinality
- complete domain/range logic
- complex OWL reasoning rules

So if you are a beginner, do not expect this repository alone to answer:

"Is this metadata record fully valid according to every DataCite rule?"

That question usually needs:

- schema validation
- business rule validation
- or application-level checks

This repository is primarily a semantic description and packaging layer.

## The distribution files: what they are and why they matter

This is another key section because the distribution files are the easiest entry point for downstream reuse.

### The three distribution files

The `dist/` folder contains three related files:

1. `dist/datacite-4.6.jsonld`
2. `dist/datacite-4.6.ttl`
3. `dist/datacite-4.6.rdf`

All three represent the same overall bundled schema content, but in different formats.

### `dist/datacite-4.6.jsonld`

This is the main integrated bundle.

It packages the repository's linked-data definitions into a single JSON-LD graph.

That means instead of reading:

- every class file separately
- every property file separately
- every vocabulary scheme file separately
- every vocabulary term file separately

you can read one bundled file.

This is especially useful for:

- loading the whole schema into a tool
- shipping one file to downstream users
- reducing file-by-file fetches
- archiving a versioned snapshot

### `dist/datacite-4.6.ttl`

This is the same bundled information serialized as Turtle.

Turtle is a compact RDF text format. It is often easier to read than RDF/XML and is widely used by RDF tools.

If a downstream RDF tool prefers Turtle, this is the best file to use.

### `dist/datacite-4.6.rdf`

This is the same bundled information serialized as RDF/XML.

RDF/XML is older and more verbose, but some RDF systems still expect it.

If a downstream system needs RDF/XML specifically, this file is the compatibility option.

### Exactly what is inside the current distribution

The current bundled JSON-LD distribution contains `258` graph nodes.

That total comes from:

- `1` synthetic ontology node created by the build script
- `21` class nodes
- `78` property nodes
- `11` vocabulary scheme nodes
- `147` vocabulary term nodes

This is an important detail:

The distribution bundle is not just a zip-like copy of files. It is a **normalized graph** assembled from the manifest.

### How the distribution is built

The distribution is generated by:

- `scripts/build-distribution.js`

This script:

1. reads `manifest/datacite-4.6.json`
2. collects the class URLs listed in the manifest
3. collects the property URLs listed in the manifest
4. collects every vocabulary scheme and term URL listed in the manifest
5. loads those source files from disk
6. normalizes them into one consistent bundled shape
7. writes the JSON-LD bundle
8. tries to write Turtle and RDF/XML versions

### Important detail: what the distribution does **not** include

Even though the manifest also lists context-related files, the distribution build script does **not** bundle those context files into the graph payload.

Instead, the script bundles:

- classes
- properties
- vocabulary schemes
- vocabulary terms

and it gives the final bundle its own generated `@context`.

This matters because beginners often assume the distribution is a byte-for-byte merge of every JSON-LD file in the repository. It is not.

It is a curated bundle of the semantic resource nodes, plus one added ontology node.

### How the script normalizes the source files

When building the bundle, the script makes the data more consistent.

For example, it:

- removes per-file `@context` values from the nodes it loads
- renames `@id` to `id` when needed
- renames `@type` to `type` when needed
- renames `rdfs:label` to `label` when needed
- renames `rdfs:comment` to `comment` when needed
- adds `seeAlso` links back to the original source file URL
- skips duplicate nodes if the same node IRI appears more than once

This is helpful because source files do not all share exactly the same internal shape:

- class and property files use raw RDF terms like `@id` and `rdfs:label`
- many vocabulary files use shorter keys like `id`, `type`, and `prefLabel`

The distribution smooths those differences into one easier-to-consume bundle.

### The ontology node added by the build script

The first node in the distribution is an `owl:Ontology` node created by the build script.

This node gives the bundle:

- a bundle-level identifier
- a human-readable title
- a version value
- a creation date
- a license link
- a source link back to the manifest
- `seeAlso` links to the `.jsonld`, `.ttl`, and `.rdf` outputs

This is useful metadata about the bundle itself, not about a single DataCite field.

### External tool dependency for `.ttl` and `.rdf`

The build script uses the `riot` command-line tool to create the Turtle and RDF/XML files.

That means:

- the JSON-LD bundle can always be written by the Node script itself
- the `.ttl` and `.rdf` files depend on `riot` being available on the machine

If `riot` is missing, the script is designed to warn and skip those files rather than crash immediately.

For a beginner, the practical takeaway is:

If you only see the `.jsonld` file after a build, check whether `riot` is installed.

## The scripts, explained simply

### `scripts/manifest-sync.js`

This script keeps the manifest aligned with the files that actually exist on disk.

It supports these main modes:

- `--check`: compare the generated manifest to the current saved manifest
- `--write`: rewrite the manifest from the current file layout
- `--validate`: make sure every manifest URL points to a real file

This script scans:

- `class/`
- `property/`
- `context/`
- `vocab/`

and rebuilds the manifest structure from what it finds.

Why this matters:

If someone adds or removes schema files but forgets to update the manifest, the manifest can become stale. This script prevents that drift.

At the moment, the manifest is synchronized and its file links resolve correctly.

### `scripts/build-distribution.js`

This is the bundling script.

Use it when you want to regenerate:

- `dist/datacite-4.6.jsonld`
- `dist/datacite-4.6.ttl`
- `dist/datacite-4.6.rdf`

This is the script that turns many small source files into one integrated bundle.

### `scripts/generate-index-pages.js`

This script creates human-readable section index pages for the repository.

It writes:

- `class/index.html`
- `property/index.html`
- `vocab/index.html`
- `context/index.html`
- `dist/index.html`
- `manifest/index.html`

These pages are helpful for web browsing because they:

- list files
- show counts
- show labels and descriptions
- make it easier to click through the namespace

This script is documentation-focused. It does not change the semantic meaning of the JSON-LD resources.

### Typical maintenance command sequence

If you are maintaining the repository, the most useful command sequence is:

```bash
node scripts/manifest-sync.js --check
node scripts/manifest-sync.js --write --validate
node scripts/build-distribution.js
node scripts/generate-index-pages.js
```

In plain English, that sequence means:

1. check whether the manifest is still in sync
2. rewrite and validate the manifest if needed
3. rebuild the distribution bundle
4. refresh the human-readable section index pages

This is the shortest practical summary of the repository's maintenance workflow.

## How the source files and generated files relate to each other

This relationship is central to understanding the repository.

### Source files

These are the files you treat as hand-maintained semantic inputs:

- `class/*.jsonld`
- `property/*.jsonld`
- `vocab/**/**/*.jsonld`
- `context/*.jsonld`
- `vocab/context.jsonld`
- `vocab/*/context.jsonld`
- `manifest/datacite-4.6.json`

### Generated files

These are files produced from source files or from supporting workflows:

- `dist/datacite-4.6.jsonld`
- `dist/datacite-4.6.ttl`
- `dist/datacite-4.6.rdf`
- section HTML index pages such as `class/index.html` and `dist/index.html`

### Experimental files

These are useful, but they are not the main canonical schema layer:

- most files in `Input files/`
- `context/runner.jsonld` as an example instance
- `context/runner.nq` and `context/runner.err` as experiment outputs

The cleanest beginner rule is:

If you want the authoritative semantic definition, start with the source files and the manifest.  
If you want one easy bundle, use `dist/`.  
If you want experiments and learning material, inspect `Input files/` and the runner files.

## The XML and round-trip experiment files

This repository does not only contain schema definitions. It also contains evidence of transformation experiments.

The most useful guide to those experiments is:

- `Input files/codes&steps.md`

That file documents a workflow that:

1. starts from example DataCite XML
2. converts it into XML-shaped JSON using `xml-js`
3. converts that JSON back into XML
4. canonicalizes both XML documents
5. compares the canonicalized versions
6. validates the round-tripped XML against the DataCite schema

### Why these files matter

These experiment files answer a different question from the main schema folders.

The main schema folders ask:

"How do we model DataCite semantics as linked data?"

The experiment files ask:

"Can we preserve XML structure well enough to round-trip XML into JSON and back?"

Those are related goals, but they are not the same goal.

### Key experiment files

Important files in `Input files/` include:

- `Input files/datacite-example-full-v4.xml`: example source XML
- `Input files/XML-Shaped-JSON.json`: XML-like JSON version
- `Input files/roundtrip.xml`: XML recreated from that JSON
- `Input files/original.c14n.xml`: canonicalized original XML
- `Input files/roundtrip.c14n.xml`: canonicalized round-tripped XML
- `Input files/metadata-4.6.xsd` and related `include/` XSDs: validation schema files
- `Input files/runner.ttl` and `Input files/runner-pretty.ttl`: RDF/Turtle experiment outputs
- `Input files/diff.json`: comparison output
- `Input files/validate_xml.rb`: validation helper

### Why the XML-shaped JSON format looks unusual

`Input files/XML-Shaped-JSON.json` is intentionally shaped to preserve XML structure.

That is why it uses:

- `attrs` for XML attributes
- `value` for text nodes
- nested objects that mirror XML elements

This format is good for round-tripping because it keeps the XML shape.

It is less convenient than ordinary application JSON, but much better for faithful XML reconstruction.

### Important beginner distinction: semantic JSON vs XML-shaped JSON

There are two different "JSON ideas" in this repository:

1. **XML-shaped JSON**  
   This tries to preserve XML structure exactly enough to convert back to equivalent XML.

2. **JSON-LD / semantic JSON**  
   This tries to preserve machine-readable meaning through linked-data mappings.

These two goals overlap, but they are not identical.

This distinction matters because a beginner might assume there is only one JSON format in the repository. There is not.

### Caveat about `Input files/validate_xml.rb`

The validation helper script references:

- `require_relative 'lib/bolognese'`

but that local file is not present in the current repository snapshot.

So the script is best understood as:

- a record of the intended validation approach

not necessarily:

- a ready-to-run script in a clean checkout without extra setup

## Important caveats and beginner warnings

This section is here to prevent common misunderstandings.

### 1. The namespace is a staging namespace

The files use:

- `https://schema.stage.datacite.org/linked-data/`

The word `stage` strongly suggests this is a staging namespace rather than a final production namespace.

For a beginner, that means:

- treat the identifiers as current repository identifiers
- do not assume this exact hostname is the final permanent production location unless project owners confirm it

### 2. The model is descriptive, not a full validator

This repository gives semantic descriptions and packaging.

It does not by itself replace:

- XSD validation
- JSON Schema validation
- full business-rule validation
- DOI registration service behavior

### 3. Some experiment outputs are not polished canonical outputs

The experiment files are valuable, but they are not always the cleanest source of truth.

That is normal in a working repository.

For example, experimental outputs can reflect:

- work in progress
- tool-specific output
- test runs
- partial transformations

So if you see a mismatch between an experiment file and a canonical schema file, trust the canonical schema layer first.

### 4. `context/runner.nq` is currently not clean N-Quads output

At the moment, `context/runner.nq` contains an error trace caused by a failed attempt to dereference the relative context path `./fullcontext.jsonld`, rather than containing clean N-Quads data.

`context/runner.err` is currently empty.

This matters because the filename `runner.nq` suggests "RDF quads output", but the current content behaves more like captured error output.

For a beginner:

- treat `context/runner.jsonld` as the useful example
- do not assume `context/runner.nq` is a trusted final RDF export in its current state



## If you are trying to understand thiws repository for the first time

This is the easiest reading order for a beginner:

1. Read this `info.md` file.
2. Open `README.md` for the shorter overview.
3. Open `manifest/datacite-4.6.json` to see the inventory.
4. Open `dist/datacite-4.6.jsonld` if you want one bundled machine-readable file.
5. Compare one file from each of these folders:
   `class/`, `property/`, and `vocab/`.
6. Open `context/fullcontext.jsonld` to see how the compact keys are interpreted.
7. Open `context/runner.jsonld` to see what instance data looks like.
8. Open `Input files/codes&steps.md` if you want to understand the XML round-trip experiments.

If you follow that order, the repository is much easier to understand.

## A simple "mental map" of the whole project

If you prefer to keep one simple picture in your head, use this:

- `class/` says what kinds of things exist
- `property/` says what fields describe those things
- `vocab/` says what controlled values some fields can use
- `context/` says how to read compact JSON as linked data
- `manifest/` says which files belong to the versioned schema set
- `dist/` gives you one bundled export of the semantic resources
- `scripts/` keep the above synchronized and generate outputs
- `Input files/` show transformation experiments and validation work

That is the repository in one map.

## What this repository is good for

This repository is especially useful when you want to:

- publish DataCite schema concepts as linked-data resources
- give DataCite metadata fields stable IRIs
- describe controlled vocabularies in a standard way
- build browser-browsable schema pages
- create a reusable machine-readable schema bundle
- help developers understand how DataCite-like JSON can map into linked data

## What this repository is not trying to be

It is not, by itself:

- a full application for minting or registering DOIs
- a complete business-rule validator
- a replacement for all DataCite XML or JSON processing tools
- a guarantee that every experiment file is production-ready

Thinking about the repository this way will save you a lot of confusion.

## Final takeaway

The best way to understand this repository is to see it as a **semantic packaging layer** for the DataCite metadata schema.

It gives DataCite concepts:

- names
- identifiers
- definitions
- controlled values
- JSON-LD interpretation rules
- a manifest
- a bundled distribution

That is the core achievement of the project.

The source folders define the model.  
The scripts keep it synchronized.  
The distribution files package it for reuse.  
The experiment files show how it connects to XML transformation work.

If you keep those four sentences in mind, the whole repository stays understandable.
