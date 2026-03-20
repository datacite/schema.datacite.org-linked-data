# Beginner Guide: Upgrading This Repo from DataCite 4.6 to 4.7

This guide explains exactly how the repository was upgraded from DataCite schema `4.6` to `4.7`.

It is written for someone who is new to:

- Git
- GitHub
- branches
- pull requests
- GitHub Actions
- this repository

If you follow this guide carefully, you should be able to repeat the `4.6 -> 4.7` upgrade process without someone standing next to you.

## What This Upgrade Changed

DataCite `4.7` introduced these schema changes:

1. New `resourceTypeGeneral` values: `Poster` and `Presentation`
2. New `relatedIdentifierType` values: `RAiD` and `SWHID`
3. New `relationType` value: `Other`
4. New `relationTypeInformation` sub-property for `RelatedIdentifier`
5. New `relationTypeInformation` sub-property for `RelatedItem`

Official release references:

- DataCite schema homepage: <https://schema.datacite.org/>
- DataCite 4.7 kernel page: <https://schema.datacite.org/meta/kernel-4.7/>
- DataCite 4.7 version update notes: <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- DataCite 4.7 `RelatedIdentifier` property docs: <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>
- DataCite 4.7 `resourceTypeGeneral` appendix: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>
- DataCite 4.7 `relationType` appendix: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/relationType/>

## Important Words in Simple English

If you are new to GitHub, these are the only words you need:

- `repository` or `repo`: the project folder on GitHub
- `branch`: a safe copy of the repo where you make changes
- `main`: the production branch; when changes land here they are treated as official
- `commit`: a saved checkpoint of your changes
- `pull request` or `PR`: a request to merge your branch into `main`
- `GitHub Actions`: automation that GitHub runs for you
- `workflow`: one named GitHub Action job
- `artifact`: a downloadable zip of files produced by a workflow

In this repo, `main` matters because pushing to `main` triggers deployment.

## The High-Level Idea

The upgrade has two parts:

1. Update the source files that define the schema
2. Generate the versioned outputs and indexes from those source files

Do not think of this repo as "just edit one file." It is a small system:

- `vocab/` holds controlled vocabulary values
- `property/` holds property definitions
- `context/` holds JSON-LD context mappings
- `manifest/` holds version inventories and release metadata
- `dist/` holds generated distribution bundles
- `index.html` and the section `index.html` files are generated discovery pages

The safest rule is:

- edit source files by hand
- let scripts or GitHub Actions generate the output files

## Exact 4.7 File Changes

These are the important files that were added or changed for the `4.6 -> 4.7` upgrade.

### New vocabulary term files

Create these files:

- `vocab/resourceTypeGeneral/Poster.jsonld`
- `vocab/resourceTypeGeneral/Presentation.jsonld`
- `vocab/relatedIdentifierType/RAiD.jsonld`
- `vocab/relatedIdentifierType/SWHID.jsonld`
- `vocab/relationType/Other.jsonld`

### Updated vocabulary scheme files

Update these files so the new terms are included in `hasTopConcept`:

- `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`
- `vocab/relatedIdentifierType/relatedIdentifierType.jsonld`
- `vocab/relationType/relationType.jsonld`

### New property file

Create:

- `property/relationTypeInformation.jsonld`

### Updated context mapping

Update:

- `context/fullcontext.jsonld`

This is where the new key `relationTypeInformation` is mapped into the JSON-LD context.

### New release-matrix file

Create:

- `manifest/release-matrix-4.6-4.7.json`

This is the human-readable and machine-readable record of exactly what changed between the two versions.

### Generated version files

These are created or refreshed by the scripts/workflow:

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

### Extra 4.7 files already present in this repo

These also exist in the repo:

- `dist/datacite-4.7-owl-properties.properties`
- `dist/datacite-4.7-owl-properties.ttl`

Important note:

- the current manual snapshot workflow does not generate these files
- if you need files like these for a future version, treat them as a separate manual step unless new automation is added

## Source Files vs Generated Files

This distinction is important.

### Files you usually edit by hand

- files in `vocab/...` for new controlled terms
- vocabulary scheme files in `vocab/.../...jsonld`
- files in `property/`
- `context/fullcontext.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

### Files you usually do not edit by hand

- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`
- `dist/datacite-current.jsonld`
- the `index.html` files used as generated listing pages

For this repo, those output files are best produced by the scripts or the GitHub Action workflow.

## The Official DataCite References You Should Check First

Before making any repo changes, read the official DataCite documentation so you know what you are implementing.

### Release-level references

- DataCite schema homepage: <https://schema.datacite.org/>
- DataCite 4.7 release notes / version update: <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>

### Term-level references

- `Poster` and `Presentation`: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>
- `RAiD` and `SWHID`: these appear in the 4.7 `RelatedIdentifier` docs and the version update page
- `Other` relation type: <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/relationType/>
- `relationTypeInformation`: <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

### Official example XML files

These are useful because they show real 4.7 examples:

- Poster example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-poster-v4.xml>
- Presentation example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-presentation-v4.xml>
- relationTypeInformation example: <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-relationtypeinformation-v4.xml>

## Recommended Process for Beginners

If you are not comfortable with Git, use this process:

1. Create a new branch from `main`
2. Edit the source files on that branch
3. Run the manual GitHub Action on that branch
4. Let the workflow generate and commit the output files back to the branch
5. Open a pull request
6. Merge into `main`
7. Let the deploy workflow publish the result

This is safer than editing `main` directly.

## Step-by-Step: GitHub Website Path

This is the easiest path for someone who wants to use GitHub in the browser.

### Step 1: Open the repository

Open the repository on GitHub.

### Step 2: Create a branch

Create a new branch from `main`.

Use a name like:

- `upgrade-4.7`
- `schema-4.7-release`
- `datacite-4.7-update`

Why this matters:

- you should not make direct release-preparation edits on `main`
- the branch is your safe workspace

### Step 3: Add the new vocabulary term files

Create these files and copy the correct DataCite 4.7 definitions into them:

- `vocab/resourceTypeGeneral/Poster.jsonld`
- `vocab/resourceTypeGeneral/Presentation.jsonld`
- `vocab/relatedIdentifierType/RAiD.jsonld`
- `vocab/relatedIdentifierType/SWHID.jsonld`
- `vocab/relationType/Other.jsonld`

What each file does:

- each file defines one official controlled vocabulary term as linked data
- each file has the term label, definition, example, and scheme membership

### Step 4: Update the vocabulary scheme files

Edit:

- `vocab/resourceTypeGeneral/resourceTypeGeneral.jsonld`
- `vocab/relatedIdentifierType/relatedIdentifierType.jsonld`
- `vocab/relationType/relationType.jsonld`

What to do:

1. Find the `hasTopConcept` list
2. Add the new term URLs
3. Make sure the new term URL matches the file you created

Examples from the 4.7 upgrade:

- add `https://schema.stage.datacite.org/linked-data/vocab/resourceTypeGeneral/Poster`
- add `https://schema.stage.datacite.org/linked-data/vocab/resourceTypeGeneral/Presentation`
- add `https://schema.stage.datacite.org/linked-data/vocab/relatedIdentifierType/RAiD`
- add `https://schema.stage.datacite.org/linked-data/vocab/relatedIdentifierType/SWHID`
- add `https://schema.stage.datacite.org/linked-data/vocab/relationType/Other`

### Step 5: Add the new property file

Create:

- `property/relationTypeInformation.jsonld`

Why this is needed:

- DataCite 4.7 added `relationTypeInformation`
- without this file, the new property does not exist in the linked-data repo

Example structure:

```json
{
  "@context": {
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "schema": "https://schema.stage.datacite.org/linked-data/",
    "datacite": "https://schema.stage.datacite.org/linked-data/"
  },
  "@id": "https://schema.stage.datacite.org/linked-data/property/relationTypeInformation",
  "@type": "rdf:Property",
  "rdfs:label": "relationTypeInformation",
  "rdfs:comment": "Additional information about the selected relationType, if appropriate."
}
```

### Step 6: Update the full context

Edit:

- `context/fullcontext.jsonld`

Add the new mapping:

```json
"relationTypeInformation": {
  "@id": "property:relationTypeInformation",
  "@type": "xsd:string"
}
```

Why this is needed:

- without this mapping, the JSON-LD context would not know how to interpret the new key

### Step 7: Create the release-matrix file

Create:

- `manifest/release-matrix-4.6-4.7.json`

This file should record:

- `fromVersion`
- `toVersion`
- `releaseDate`
- a `changes` list
- a `sources` list

Use the 4.7 file in this repo as the model.

The change list for `4.6 -> 4.7` is:

1. `Poster` and `Presentation` added to `resourceTypeGeneral`
2. `RAiD` and `SWHID` added to `relatedIdentifierType`
3. `Other` added to `relationType`
4. `relationTypeInformation` added under `RelatedIdentifier`
5. `relationTypeInformation` added under `RelatedItem`

Why this file matters:

- it gives a simple summary of the release
- it helps future maintainers see what changed between versions
- it is now surfaced in `manifest/index.html`

### Step 8: Commit your source changes to the branch

After your source files are edited, commit them to the branch.

At this point, your branch should contain the manual source edits, but it may not yet contain:

- the versioned manifest
- the distribution files
- the current pointers
- the generated index pages

That is normal.

### Step 9: Run the manual GitHub Action

Open the `Actions` tab in GitHub.

Choose:

- `Build Versioned Snapshot`

Click:

- `Run workflow`

Choose these values:

- Branch: your upgrade branch
- `version`: `4.7`
- `release_date`: `2026-03-03`
- `commit_generated_files`: `true`

This is the most important automation step.

Important:

- `release_date` should be the official DataCite release date, not the day you happen to run the workflow
- for `4.7`, the correct release date is `2026-03-03`
- if you rerun the workflow because the stored release date is wrong, pass the correct `release_date` again explicitly

### Step 10: Wait for the workflow to finish

What the workflow does:

1. checks out your branch
2. creates or updates `manifest/datacite-4.7.json`
3. rebuilds the `dist/` files
4. updates `datacite-current` pointers
5. regenerates the section index pages
6. updates the root `index.html`
7. commits the generated files back to your branch if `commit_generated_files` is turned on
8. uploads a workflow artifact zip

Important:

- the workflow uses `.github/workflows/release-snapshot.yml`
- the main script it runs is `scripts/release-snapshot.js`
- the root homepage is updated by `scripts/update-root-index.js`

### Step 11: Review the workflow commit

After the workflow finishes, your branch should have a new bot-created commit.

Review these files:

- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`
- `dist/datacite-current.jsonld`
- `manifest/index.html`
- `dist/index.html`
- `index.html`

Make sure:

- `datacite-current` points to `4.7`
- `manifest/index.html` shows `release-matrix-4.6-4.7.json`
- the homepage shows `4.7` as the current staged version

### Step 12: Open a pull request

Now open a pull request from your branch into `main`.

In plain English:

- this is how you ask GitHub to merge your work into the official branch

In your PR description, explain:

- which DataCite 4.7 changes you implemented
- which new files you created
- that you ran the manual snapshot workflow
- whether the workflow committed generated files back to the branch

### Step 13: Merge the pull request

When the PR is approved, merge it into `main`.

Why this matters:

- `main` is the branch that gets deployed
- merging is the step that makes the repo officially contain `4.7`

### Step 14: Let deployment run

After merge, the deploy workflow runs automatically because this repo deploys on push to `main`.

This means:

- merge into `main` -> GitHub Actions deploy workflow runs -> repo contents are published

### Step 15: Verify the final result

Check these pages and files:

- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `manifest/release-matrix-4.6-4.7.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-current.jsonld`
- `manifest/index.html`
- `index.html`

What you should see:

- `4.7` exists as a frozen versioned release
- `datacite-current` points to `4.7`
- the release matrix is visible
- the homepage points people to the new current version

## Step-by-Step: Local Terminal Path

If you are comfortable with a terminal, this is faster.

### Step 1: Start from `main`

```bash
git checkout main
git pull
git checkout -b codex/upgrade-4.7
```

### Step 2: Make the source-file edits

Edit:

- new term files in `vocab/...`
- scheme files in `vocab/...`
- `property/relationTypeInformation.jsonld`
- `context/fullcontext.jsonld`
- `manifest/release-matrix-4.6-4.7.json`

### Step 3: Generate the versioned outputs

The simplest command is:

```bash
node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03
```

That command:

1. creates or updates `manifest/datacite-4.7.json`
2. validates and rewrites the manifest from disk content
3. generates the versioned distribution files in `dist/`
4. updates the current pointers
5. regenerates the section indexes
6. updates the root `index.html`

Note:

- local Turtle and RDF/XML generation depends on the `riot` command being available on your machine
- if local generation fails because `riot` is missing, use the GitHub Action path instead

### Step 4: Review the output

```bash
git status
```

Look for:

- `manifest/datacite-4.7.json`
- `manifest/datacite-current.json`
- `dist/datacite-4.7.jsonld`
- `dist/datacite-4.7.ttl`
- `dist/datacite-4.7.rdf`
- `dist/datacite-current.jsonld`
- generated index pages

### Step 5: Commit and push

```bash
git add .
git commit -m "Add DataCite 4.7 release artifacts"
git push -u origin codex/upgrade-4.7
```

Then open a pull request into `main`.

## Helpful Commands

These are the commands you are most likely to need.

### Check or rewrite the manifest

```bash
node scripts/manifest-sync.js --check --validate --version 4.7
node scripts/manifest-sync.js --write --validate --version 4.7
```

### Build the versioned distribution only

```bash
node scripts/build-distribution.js --version 4.7
```

### Update only the current pointers

```bash
node scripts/update-current-pointers.js --version 4.7
```

### Update only the root homepage

```bash
node scripts/update-root-index.js
```

### Full release snapshot command

```bash
node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03
```

### Build without moving the current pointers

```bash
node scripts/release-snapshot.js --version 4.7 --release-date 2026-03-03 --no-set-current
```

Use `--no-set-current` when you want to test output files without making `4.7` the default current release.

## Real Examples from the 4.7 Upgrade

### Example 1: `Poster`

Local repo file:

- `vocab/resourceTypeGeneral/Poster.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>
- <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-poster-v4.xml>

Key idea:

- this term is not just a word in release notes
- it needs its own term file in the repo
- it also must be added to the scheme file so the vocabulary knows it is an official top concept

### Example 2: `Presentation`

Local repo file:

- `vocab/resourceTypeGeneral/Presentation.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/resourceTypeGeneral/>
- <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-presentation-v4.xml>

### Example 3: `RAiD`

Local repo file:

- `vocab/relatedIdentifierType/RAiD.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

### Example 4: `SWHID`

Local repo file:

- `vocab/relatedIdentifierType/SWHID.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/introduction/version-update/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

### Example 5: `Other` relation type

Local repo file:

- `vocab/relationType/Other.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/relationType/>
- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>

Important behavior:

- when `relationType="Other"` is used, DataCite recommends adding `relationTypeInformation`

### Example 6: `relationTypeInformation`

Local repo file:

- `property/relationTypeInformation.jsonld`

Supporting context file:

- `context/fullcontext.jsonld`

Official docs:

- <https://datacite-metadata-schema.readthedocs.io/en/4.7/properties/relatedidentifier/>
- <https://schema.datacite.org/meta/kernel-4.7/example/datacite-example-relationtypeinformation-v4.xml>

## What the Workflow Now Automates

The manual workflow in this repo can now do all of the following:

1. build a versioned release snapshot
2. commit generated outputs back to the selected branch
3. upload artifacts
4. update the root `index.html`

That means you do not need to generate every output file by hand.

## Which File Controls the Manual Workflow

The manual workflow lives here:

- `.github/workflows/release-snapshot.yml`

Important input:

- `commit_generated_files`

If this is:

- `false`: GitHub only produces an artifact zip
- `true`: GitHub produces the files and commits them back to the branch

## Which Script Updates the Root Homepage

This script updates the root homepage:

- `scripts/update-root-index.js`

It is called automatically by:

- `scripts/release-snapshot.js`

So after the workflow runs, the root `index.html` should reflect the new current version and version links.

## Common Mistakes

These are the mistakes most likely to cause confusion.

### Mistake 1: Adding a new term file but not updating the scheme file

If you create `Poster.jsonld` but do not add it to `resourceTypeGeneral.jsonld`, the vocabulary is incomplete.

### Mistake 2: Adding a property file but not updating the context

If you create `relationTypeInformation.jsonld` but do not add it to `context/fullcontext.jsonld`, the property cannot be used cleanly in JSON-LD input.

### Mistake 3: Forgetting the release matrix

If you skip `manifest/release-matrix-4.6-4.7.json`, future maintainers lose the quick summary of what changed.

### Mistake 4: Editing generated files first

If you hand-edit generated files before the source files are correct, you can end up with inconsistent output.

### Mistake 5: Running the workflow on the wrong branch

Always check the branch selector before clicking `Run workflow`.

### Mistake 6: Forgetting `commit_generated_files`

If you leave this unchecked, GitHub will build the files but will not save them into the branch.

### Mistake 7: Using the wrong release date

The release date should match the official DataCite release, not your work date.

For `4.7`, use:

- `2026-03-03`

### Mistake 8: Merging before reviewing `datacite-current`

If `manifest/datacite-current.json` points to the wrong version, the repo may still look like the old release is current.

## What to Check Before You Merge

Before merging into `main`, confirm all of these:

1. `manifest/datacite-4.7.json` exists
2. `manifest/datacite-current.json` points to `4.7`
3. `dist/datacite-4.7.jsonld` exists
4. `dist/datacite-4.7.ttl` exists
5. `dist/datacite-4.7.rdf` exists
6. `dist/datacite-current.jsonld` points to `4.7`
7. `manifest/release-matrix-4.6-4.7.json` exists
8. `manifest/index.html` lists the release matrix
9. `index.html` shows `4.7` as the current staged version

## What Happens After Merge

Once the branch is merged into `main`:

1. GitHub sees a push to `main`
2. the deploy workflow runs
3. the repo contents are uploaded to the deployment target
4. the new version becomes the public staged version

In simple terms:

- branch work prepares the release
- merge to `main` publishes it

## If You Need to Repeat This for a Future Version

If you later need to do `4.7 -> 4.8`, follow the same pattern:

1. read the official DataCite release notes first
2. create or update the term/property/context source files
3. create a new release matrix like `manifest/release-matrix-4.7-4.8.json`
4. run the release snapshot workflow for the new version
5. let the workflow commit generated files back to the branch
6. review the branch
7. merge into `main`

When repeating this for a future version, replace:

- version numbers in file names
- release date
- controlled terms
- new properties
- examples and release-matrix entries

Do not assume the next release will have the same kinds of changes as `4.7`.

## Final Practical Advice

If you are new to all of this, the safest rule is:

1. never edit `main` directly
2. make source-file changes on a branch
3. use the manual workflow to generate the outputs
4. review what the workflow committed
5. merge only after the branch looks correct

That is the simplest reliable way to upgrade this repo.
