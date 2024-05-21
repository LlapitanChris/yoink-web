import '../components/FxPage.js';
import { html } from 'https://cdn.skypack.dev/lit-element';
import { classMap } from 'https://cdn.skypack.dev/lit-html/directives/class-map';	

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


	xpath(query, type) {
		if (!this.xmlDocument) {
			console.error(`no xml document to evaluate xpath query ${query}`);
			return;
		}
		return this.xmlDocument.evaluate(query, this.xmlDocument, null, type, null);
	}

	render() {
		// get parameters from url
		this.setPropsFromUrl();

		const classes = {
			grid: this.display === 'grid',
			flex: this.display === 'flex',
			list: this.display === 'list'
		}

		// see if we've implemented the headerTemplate and elementsTemplate functions
		if (!this.headerTemplate) {
			console.error('headerTemplate function not implemented');
		}
		if (!this.elementsTemplate) {
			console.error('elementsTemplate function not implemented');
		}

		return html`
			<fx-page>
				${this.headerTemplate()}
				<fx-element-list class="${classMap(classes)}">
					${this.elementsTemplate()}
				</fx-element-list>
			</fx-page>
		`;
	}

	createComponentsFromXml(query, tagName) {
		// create the components from the xml
		const nodes = this.xpath(query, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		let node = nodes.iterateNext();
		const components = [];
		while (node) {
			// create the component
			const component = document.createElement(tagName);
			component.xmlNode = node;
			component.xmlDocument = this.xmlDocument;
			components.push(component);
			node = nodes.iterateNext();
		}
		return components;
	}

}