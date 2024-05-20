import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { Task } from 'https://cdn.skypack.dev/@lit-labs/task';

// import XML to HTML utility
import { XmlToHtml } from '../utilities/XsltHelper.js'

// import sub components
import '../components/FxBaseTable.js';
import '../components/FxBaseTableDetail.js';
import '../components/FxField.js';

export default class TablePage extends LitElement {

	constructor() {
		super();
		this.fragment;
		this.id;
		this.xml;
	}

	static get properties() {
		return {
			id: { type: String },
			fragment: { type: Object },
		}

	}

	static get styles() { 
		return css`

			:host {
				display: block;
				margin: 10px;
				--title-size: 1.5rem;
				--display: flex;
				--flex-direction: column;
				--flex-wrap: wrap;
				--gap: 15px;
			}

			::slotted(*) {
				--title-size: 1.5rem;
			}

			::slotted(fx-base-table) {
				max-width: 700px;
			}

			#container {
				display: var(--display);
				flex-direction: var(--flex-direction);
				flex-wrap: var(--flex-wrap);
				gap: var(--gap);
			}
		
		`;
	}



	render() {
		// get id from url
		const url = new URL(window.location);
		this.id = url.searchParams.get('id');

		// get the parent
		const parent = this.closest('fx-app');
		const xml = parent.xml;


		let headerHTML, baseTables;

		if (this.id) {
			headerHTML = html`<h1>Base Table ${this.id}</h1>`;
			baseTables = xml.evaluate(`//BaseTable[@id="${this.id}"]`, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		} else {
			headerHTML = html`<h1>Base Table List</h1>`;
			baseTables = xml.evaluate('//BaseTable', xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		}

		// create the base tables from the xml
		let baseTable = baseTables.iterateNext();
		while (baseTable) {
			const baseTableElement = document.createElement('fx-base-table');
			baseTableElement.xmlNode = baseTable;
			baseTableElement.xmlDocument = xml;
			baseTableElement.classList.add('bordered');
			this.appendChild(baseTableElement);

			baseTable = baseTables.iterateNext();
		}

		return [
			headerHTML,
			// render the slot
			html`<div id='container'><slot></slot></div>`
		]
	}


}

customElements.define('fx-table-page', TablePage);