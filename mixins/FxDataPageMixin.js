
export const FxDataPageMixin = (baseClass) => class extends baseClass { 

	static get properties() { 
		return {
			xmlDocument: { type: Object },
		}
	}

	setPropsFromUrl() {
		// set properties from url parameters
		const url = new URL(window.location);
		url.searchParams.forEach((value, key) => {
			this[key] = value;
		});
	}

	get xmlDocument() {
		// get parent app element
		const parent = this.closest('fx-app');
		if (!parent) {
			console.error('no parent app element found, this element must be a child of fx-app with the xml property set.');
			return;
		} else if (!parent.xmlDocument) {
			console.error('no xml property found on parent app element');
			return;
		}
		return parent.xmlDocument;
	}


	xpath(query, type) {
		if (!this.xmlDocument) {
			console.error(`no xml document to evaluate xpath query ${query}`);
			return;
		}
		return this.xmlDocument.evaluate(query, this.xmlDocument, null, type, null);
	}
}