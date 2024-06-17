import '../components/FxPage.js';
import { html } from 'https://cdn.skypack.dev/lit-element';

import { xpath } from '../utilities/xpath.js';

export const FxDataPageMixin = (baseClass) => class extends baseClass { 

	static get properties() { 
		return {
			xmlDocument: { type: Object },
		}
	}

	// no shadow dom
	createRenderRoot() {
		return this;
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

	xpath(xpathString, resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE, xmlDocument = this.xmlDocument) {
		return xpath(xpathString, resultType, xmlDocument);
	}

	render() {
		// get parameters from url
		this.setPropsFromUrl();
		if (!this.tableTemplate) {
			console.error('no table template defined for this page');
			return;

		} else if (!this.tableData) {
			console.error('no table data defined for this page');
			return;

		} else if (!this.headerTemplate) { 
			console.error('no header template defined for this page');
			return;
		
		}

		return html`
			<fx-page>
				${this.headerTemplate}
				${this.tableTemplate(this.tableData)}
			</fx-page>
		`;


	}


}