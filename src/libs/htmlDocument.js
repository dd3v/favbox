export default class HtmlDocument {
  #text;

  constructor(text) {
    this.#text = text;
  }

  getHtmlDocument() {
    const htmlDocument = document.implementation.createHTMLDocument();
    htmlDocument.open();
    htmlDocument.write(this.#text);
    htmlDocument.close();

    return htmlDocument;
  }
}
