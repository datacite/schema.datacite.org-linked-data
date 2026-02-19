*	**class/** – definitions of major schema entities (e.g., Identifier, Creator, Title).  Each file in this folder defines an entity IRI such as https://schema.stage.datacite.org/linked-data/class/Identifier.

*	**context/** – JSON‑LD context files used to map short prefixes to IRIs (e.g., datacite.jsonld).
*   **context/datacite_api.json** -  This context is designed to translate the DataCite REST API’s JSON into an RDF graph.
    * First profile (starting ~line 727): Comprehensive ontology profile -  Full semantic mapping to DataCite 4.6 ontology. Best for semantic web applications, ontology reasoning, and complete DataCite compliance

    * responseProfile (starting ~line 1337): JSON:API response validation schema

    * submitProfile (starting ~line 1403): JSON:API submission validation schema

*	**manifest/** – manifest files that list all classes, properties and vocabularies available in a specific schema version, registry of resolvable things (tbd: along with example metadata records.)

*	**property/** – definitions of all schema properties and sub‑properties.  Each file here defines an IRI such as https://schema.stage.datacite.org/linked-data/property/givenName.

*	**vocab/** – controlled lists (enumerations) referenced by properties.  These are grouped by version (e.g., vocab/datacite-4.6/).  Each file in this folder defines a set of terms with stable IRIs.

-----

1️⃣ XML → Bolognese JSON

    bundle exec bolognese \
    datacite-example-full-v4.xml \
    -f datacite \
    -t datacite_json
**Output:**
datacite-example-4.6.json

**This is:**
* A DataCite JSON profile
* A semantic, normalized representation
* Not XML-shaped
* Not reversible back to identical XML

**Example difference:**
  
XML: 

    <identifier identifierType="DOI">10.82433/B09Z-4K37</identifier>

Bolognese JSON:

    "id": "https://doi.org/10.82433/b09z-4k37", 
    "doi": "10.82433/b09z-4k37"

This is a semantic transformation with flattened structures and expanded DOI to URL. 

----
2️⃣ XML → xml-js → XML-shaped JSON

    xml-js ... --attributes-key "@attrs" --text-key "@value"

**Output**:
XML-Shaped-JSON.json

**This is:**
* Structural
* Preserves XML shape
* Preserves attributes
* Preserves wrapper elements
* Reversible to XML

**Example difference:**

XML:

    <identifier identifierType="DOI">10.82433/B09Z-4K37</identifier>

JSON:

    "identifier": {
    "@attrs": { "identifierType": "DOI" },
    "@value": "10.82433/B09Z-4K37"
    }

7. 

| Transformation | Purpose | Reversible | XML fidelity |
| ----- | ----- | ----- | ----- |
| XML → bolognese JSON | Semantic normalization | ❌ No | ❌ No |
| XML → xml-js JSON | Structural preservation | ✅ Yes | ✅ Yes |