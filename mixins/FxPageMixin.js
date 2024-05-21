
export default FxPageMixin = (baseClass) => class extends baseClass { 

	static get properties() { 
		return {
			xmlDocument: { type: Object },
		}
	}

	get xmlDocument() {
		// get parent app element
		const parent = this.closest('fx-app');
		if (!parent) {
			console.error('no parent app element found, this element must be a child of fx-app with the xml property set.');
			return;
		}
		return parent.xml;
	}


	xpath(query, type) {
		if (!this.xmlDocument) {
			console.error(`no xml document to evaluate xpath query ${query}`);
			return;
		}
		return this.xmlDocument.evaluate(query, this.xmlDocument, null, type, null);
	}
}