const parser = new DOMParser();
const serializer = new XMLSerializer();

let example = {};
let xslt = {};

async function loadXML(name) {
    const text = await fetch(name).then((res) => res.text());
    return {
        text,
        doc: parser.parseFromString(text, 'text/xml')
    };
}

window.onload = function () {
    loadXML('math-transform.xsl').then((res) => xslt['math-ml'] = res);
    loadXML('svg-transform.xsl').then((res) => xslt['svg'] = res);
    loadXML('math-example.xml').then((res) => example['math-ml'] = res);
    loadXML('svg-example.xml').then((res) => example['svg'] = res);
}

function selectXML(name) {
    document.getElementById('xml-input').value = example[name].text;
    document.getElementById('xslt-select').value = name;
}

function applyTransform() {
    let curXsltName = document.getElementById('xslt-select').value;
    let xmlInputString = document.getElementById('xml-input').value;

    console.log(curXsltName, xmlInputString);

    const processor = new XSLTProcessor();

    processor.importStylesheet(xslt[curXsltName].doc);

    const xmlDocument = parser.parseFromString(xmlInputString, 'text/xml');

    document.getElementById('xml-output').innerHTML = serializer.serializeToString(
        processor.transformToDocument(xmlDocument));
}
