1- Create the XML-shaped JSON :

    xml-js "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/datacite-example-full-v4.xml" \
    --to-json \
    --compact true \
    --spaces 2 \
    --no-comment \
    --no-decl \
    --attributes-key "@attrs" \
    --text-key "@value" \  "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/XML-Shaped-JSON.json"

  ---

  2- Convert back to XML:
  
    xml-js "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/XML-Shaped-JSON.json" \
    --to-xml \
    --compact true \
    --spaces 2 \
    --attributes-key "@attrs" \
    --text-key "@value" \  "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/roundtrip.xml"

  ---
3- Canonicalize both XML files and diff (removes whitespace noise):

    xmllint --c14n \
    "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/datacite-example-full-v4.xml" \  "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/original.c14n.xml"
--

    xmllint --c14n \
    "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/roundtrip.xml" \ "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/roundtrip.c14n.xml"
--

    diff -u \
    "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/original.c14n.xml" \
    "/Users/selgebali/Documents/VSCode/schema.datacite.org-linked-data/Input files/roundtrip.c14n.xml" \
    | head -n 80

-----
## Results:
### Differences appear due to:
* **Issue 1:**  Comments were not preserved ( not lossless). XML contains large comment block that is not in JSON. 
* **Issue 2:** Diff is dominated by whitespace text nodes. original file has lots of newlines;  roundtrip XML has different newlines/indentation. 
* **Issue 3:** Element order changed (expected with JSON). XML has ordered children; JSON object properties are unordered.