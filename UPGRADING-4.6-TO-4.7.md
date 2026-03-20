# Beginner Guide: Upgrading This Repo from DataCite 4.6 to 4.7

This guide explains exactly what changed in the `4.6 -> 4.7` upgrade and how you would reproduce that upgrade using the current release-import automation.

If you only want the general process for future releases, read [DATACITE-RELEASE-RUNBOOK.md](/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/DATACITE-RELEASE-RUNBOOK.md) first.

Use this document when you want to understand:

- what DataCite `4.7` introduced
- which repo files were affected
- which items the detector should find
- which plan items are safe to approve
- what the final generated outputs should look like

## What DataCite 4.7 Changed

DataCite `4.7` introduced these changes:

1. `resourceTypeGeneral` added `Poster`
2. `resourceTypeGeneral` added `Presentation`
3. `relatedIdentifierType` added `RAiD`
4. `relatedIdentifierType` added `SWHID`
5. `relationType` added `Other`
6. `relationTypeInformation` was added as a sub-property for `RelatedIdentifier`
7. `relationTypeInformation` was added as a sub-property for `RelatedItem`

Official references:

- DataCite versions page: <https://schema.datacite.org/versions.html>
- DataCite `4.7` version update notes: <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- DataCite `4.7` resourceTypeGeneral appendix: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>
- DataCite `4.7` relationType appendix: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/relationType/>
- DataCite `4.7` RelatedIdentifier docs: <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>
- DataCite `4.7` RelatedItem docs: <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relateditem/>

## Plain-English View of the Repo

These are the main folders affected by a version upgrade:

- `vocab/`: controlled term files and vocabulary scheme files
- `property/`: property definitions
- `context/`: JSON-LD key mappings
- `manifest/`: version inventory files and release matrix files
- `dist/`: generated distribution bundles
- `reports/`: review plans and apply reports used by the new workflow

Think of the 4.7 upgrade as:

- new source files in `vocab/` and `property/`
- one context update
- one release-summary file in `manifest/`
- then generated outputs in `manifest/`, `dist/`, and the index pages

## Exact 4.7 Source Changes

These are the important source-level changes for `4.6 -> 4.7`.

### New vocabulary term files

Create:

- `vocab/resourceTypeGeneral/Poster.jsonld`
- `vocab/resourceTypeGeneral/Presentation.jsonld`
- `vocab/relatedIdentifierType/RAiD.jsonld`
- `vocab/relatedIdentifierType/SWHID.jsonld`
- `vocab/relationType/Other.jsonld`

What these files represent:

- `Poster` and `Presentation` are new official DataCite resource types
- `RAiD` and `SWHID` are new official `relatedIdentifierType` values
- `Other` is a new official `relationType` value

### Updated vocabulary scheme files

Update:

- `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`
- `vocab/relatedIdentifierType/relatedIdentifierType.jsonld`
- `vocab/relationType/relationType.jsonld`

What changes inside these files:

- the `hasTopConcept` list must include the new term IRIs
- the order should follow the official DataCite vocabulary ordering

### New property file

Create:

- `property/relationTypeInformation.jsonld`

This file represents the new `relationTypeInformation` property introduced in `4.7`.

### Updated context file

Update:

- `context/fullcontext.jsonld`

Add the new mapping:

```json
"relationTypeInformation": {
  "@id": "property:relationTypeInformation",
  "@type": "xsd:string"
}
```

### New release matrix

Create:

- `manifest/release-matrix-4.6-4.7.json`

This file records what changed between `4.6` and `4.7`.

For `4.7`, the change summary is:

1. `Poster`, `Presentation` added to `resourceTypeGeneral`
2. `RAiD`, `SWHID` added to `relatedIdentifierType`
3. `Other` added to `relationType`
4. `relationTypeInformation` added under `relatedIdentifier`
5. `relationTypeInformation` added under `relatedItem`

## Exact 4.7 Generated Outputs

These files are generated after the source changes are in place:

- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`
- `dist/datacite-current.jsonld`
- `class/index.html`
- `property/index.html`
- `vocab/index.html`
- `context/index.html`
- `dist/index.html`
- `manifest/index.html`
- `index.html`

There are also existing `4.7` OWL-related outputs in `dist/`, but those are not currently produced by the modular detect/apply flow and should still be treated as a separate step if needed in future releases.

## How the New Detector Should See 4.7

If you run the new detector against a repo that still only has `4.6`, it should produce a plan with four main change items:

1. one `controlled-list` item for `resourceTypeGeneral`
2. one `controlled-list` item for `relatedIdentifierType`
3. one `controlled-list` item for `relationType`
4. one `simple-property` item for `relationTypeInformation`

In plan form, that should look like this:

- `controlled-list-values-added:resourceTypeGeneral:4.7`
- `controlled-list-values-added:relatedIdentifierType:4.7`
- `controlled-list-values-added:relationType:4.7`
- `simple-property-added:relationTypeInformation:4.7`

These are all good `apply` candidates for `4.7`.

## How to Reproduce 4.7 Using the Current Automation

This section explains how you would reproduce the `4.6 -> 4.7` upgrade today using the current detect/apply workflows.

## Step 1: Create a branch

Start from `main` and create a branch such as:

- `upgrade-4.7`
- `release-4.7`

Do not work directly on `main`.

## Step 2: Run `Detect DataCite Release`

In GitHub:

1. open `Actions`
2. open `Detect DataCite Release`
3. choose your branch

For a historical `4.7` rebuild, enter:

- `version`: `4.7`
- `release_date`: `2026-03-03`
- `commit_plan_files`: `true`

If you were back on `4.6`, the detector would use the official DataCite docs and XSD files to produce a `4.7` plan.

## Step 3: Open the committed plan files on the branch

After the detect workflow finishes, open your branch and inspect:

- `reports/release-import-plan-4.7.json`
- `reports/release-import-plan-4.7.md`

Read the Markdown file first, but edit only the JSON file.

It should summarize the four `4.7` change items listed above.

## Step 4: Approve the 4.7 plan items

Edit the JSON plan and change the four main items from `proposed` to `apply`.

For the `4.7` release, these are the items that should normally be approved:

- the three controlled-list additions
- the one simple-property addition

There should not be any rename or removal items for `4.7`.

### Example: one real 4.7 plan item before approval

```json
{
  "id": "simple-property-added:relationTypeInformation:4.7",
  "kind": "simple-property-added",
  "module": "simple-property",
  "section": "relationTypeInformation",
  "status": "proposed",
  "confidence": "high",
  "summary": "Add simple property relationTypeInformation",
  "evidence": [
    "https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/",
    "https://schema.datacite.org/meta/kernel-4.7/metadata.xsd"
  ],
  "inputs": {
    "contextEntries": [
      {
        "key": "relationTypeInformation",
        "afterKey": "relationType",
        "value": {
          "@id": "property:relationTypeInformation",
          "@type": "xsd:string"
        }
      }
    ]
  },
  "targets": [
    "property/relationTypeInformation.jsonld",
    "context/fullcontext.jsonld",
    "manifest/release-matrix-4.6-4.7.json"
  ],
  "notes": []
}
```

### Example: the same 4.7 item after approval

```json
{
  "id": "simple-property-added:relationTypeInformation:4.7",
  "kind": "simple-property-added",
  "module": "simple-property",
  "section": "relationTypeInformation",
  "status": "apply",
  "confidence": "high",
  "summary": "Add simple property relationTypeInformation",
  "evidence": [
    "https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/",
    "https://schema.datacite.org/meta/kernel-4.7/metadata.xsd"
  ],
  "inputs": {
    "contextEntries": [
      {
        "key": "relationTypeInformation",
        "afterKey": "relationType",
        "value": {
          "@id": "property:relationTypeInformation",
          "@type": "xsd:string"
        }
      }
    ]
  },
  "targets": [
    "property/relationTypeInformation.jsonld",
    "context/fullcontext.jsonld",
    "manifest/release-matrix-4.6-4.7.json"
  ],
  "notes": []
}
```

For `4.7`, that is the normal pattern:

- review the detected item
- if it looks correct, change only `"status": "apply"`
- leave the rest of the item unchanged

## Step 5: Commit the approved JSON plan

Commit:

- `reports/release-import-plan-4.7.json`

You do not need to hand-edit the Markdown plan file. The apply workflow refreshes it from the JSON plan.

## Step 6: Run `Apply DataCite Release Plan`

In GitHub:

1. open `Actions`
2. open `Apply DataCite Release Plan`
3. choose your branch

Use these values:

- `plan_path`: `reports/release-import-plan-4.7.json`
- `set_current`: `true`
- `commit_generated_files`: `true`
- `apply_controlled_lists`: `true`
- `apply_simple_properties`: `true`
- `apply_property_groups`: `false`
- `apply_complex_structures`: `false`
- `apply_renames`: `false`
- `apply_removals`: `false`

These settings match the actual `4.7` change pattern.

## Step 7: What the apply workflow should create

The apply workflow should:

1. create the five new vocabulary term files
2. update the three vocabulary scheme files
3. create `property/relationTypeInformation.jsonld`
4. update `context/fullcontext.jsonld`
5. create `manifest/release-matrix-4.6-4.7.json`
6. run `scripts/release-snapshot.js`
7. regenerate the versioned manifest and distribution outputs
8. update current pointers
9. regenerate the section index pages and the root `index.html`
10. refresh `reports/release-import-plan-4.7.md` from the JSON plan
11. commit the generated files back to the branch

## Step 8: Review the result

After the workflow finishes, review these files first:

- `vocab/resourceTypeGeneral/Poster.jsonld`
- `vocab/resourceTypeGeneral/Presentation.jsonld`
- `vocab/relatedIdentifierType/RAiD.jsonld`
- `vocab/relatedIdentifierType/SWHID.jsonld`
- `vocab/relationType/Other.jsonld`
- `property/relationTypeInformation.jsonld`
- `context/fullcontext.jsonld`
- `manifest/release-matrix-4.6-4.7.json`
- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-current.jsonld`
- `manifest/index.html`
- `index.html`

Make sure:

- `manifest/datacite-current.json` points to `4.7`
- `manifest/index.html` lists `release-matrix-4.6-4.7.json`
- the root `index.html` shows `4.7` as the current staged version

## How the 4.7 Official Docs Map to Repo Files

This is the part that helps a beginner understand why each file exists.

### `Poster`

Official meaning:

- new `resourceTypeGeneral` term in DataCite `4.7`

Repo files affected:

- `vocab/resourceTypeGeneral/Poster.jsonld`
- `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official source:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>

### `Presentation`

Official meaning:

- new `resourceTypeGeneral` term in DataCite `4.7`

Repo files affected:

- `vocab/resourceTypeGeneral/Presentation.jsonld`
- `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official source:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>

### `RAiD`

Official meaning:

- new `relatedIdentifierType` term in DataCite `4.7`

Repo files affected:

- `vocab/relatedIdentifierType/RAiD.jsonld`
- `vocab/relatedIdentifierType/relatedIdentifierType.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official sources:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

### `SWHID`

Official meaning:

- new `relatedIdentifierType` term in DataCite `4.7`

Repo files affected:

- `vocab/relatedIdentifierType/SWHID.jsonld`
- `vocab/relatedIdentifierType/relatedIdentifierType.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official sources:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

### `Other`

Official meaning:

- new `relationType` term in DataCite `4.7`

Repo files affected:

- `vocab/relationType/Other.jsonld`
- `vocab/relationType/relationType.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official source:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/relationType/>

### `relationTypeInformation`

Official meaning:

- a new sub-property used with `relatedIdentifier`
- also applicable with `relatedItem`

Repo files affected:

- `property/relationTypeInformation.jsonld`
- `context/fullcontext.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

Official sources:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relateditem/>

## Example XML Files Worth Checking

These are useful for understanding the new `4.7` terms in real XML:

- Poster example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-poster-v4.xml>
- Presentation example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-presentation-v4.xml>
- relationTypeInformation example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-relationtypeinformation-v4.xml>

## Local Terminal Example

If you prefer working locally, the equivalent commands are:

```bash
git checkout main
git pull
git checkout -b upgrade-4.7

node scripts/detect-datacite-release.js --version 4.7 --release-date 2026-03-03
```

Then edit the plan file so the `4.7` change items have `status: "apply"`, and run:

```bash
node scripts/apply-datacite-release-plan.js \
  --plan reports/release-import-plan-4.7.json \
  --modules controlled-list,simple-property \
  --set-current
```

## Final Merge Path

Once the branch looks correct:

1. open a PR into `main`
2. mention that this is the `4.6 -> 4.7` release upgrade
3. mention that the approved plan applied the controlled-list and simple-property modules
4. merge after review

After merge:

- the normal deploy workflow on `main` publishes the merged files

## Quick 4.7 Checklist

Use this checklist if you only want the short version.

1. Confirm official `4.7` docs and release date.
2. Create a branch from `main`.
3. Run `Detect DataCite Release` with `version=4.7` and `release_date=2026-03-03`.
4. Open the committed plan on the branch and inspect it.
5. Mark the three controlled-list items and the one simple-property item as `apply`.
6. Commit the JSON plan to the branch.
7. Run `Apply DataCite Release Plan`.
8. Review the generated files.
9. Open a PR.
10. Merge to `main`.
