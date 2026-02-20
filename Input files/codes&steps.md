1- Create the XML-shaped JSON:
Input xml file from: https://schema.datacite.org/meta/kernel-4.6/example/datacite-example-full-v4.xml 

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

Beautify orginal.c14n.xml and roundtrip.c14.xml using online tool : https://jsonformatter.org/xml-formatter 
compare the two files using: https://codebeautify.org/xml-diff
0 changes found.

----

Using the roundtrip.c14.xml to validate against XSD using bolognese see code used validate_xml.rb. Result = ✓ XML is valid against DataCite (kernel-4) schema

Summary: XML --> JSON --> XML = valid against XSD. XML-Shaped-JSON.json is a JSON instance file based on an XML that passes the XSD requirements, using that JSON instance should be able to register a DOI. 
