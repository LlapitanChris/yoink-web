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
				padding: 10px;
				margin: 10px;
				--title-size: 1.5rem;
				--display: flex;
				--flex-direction: column;
				--flex-wrap: wrap;
				--gap: 10px;
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

		// create the base tables
		let baseTable = baseTables.iterateNext();
		while (baseTable) {
			const baseTableElement = document.createElement(this.id ? 'fx-base-table-detail' : 'fx-base-table');
			baseTableElement.xml = baseTable;
			this.appendChild(baseTableElement);

			// get the fields
			const uuid = baseTable.querySelector('UUID').textContent;
			baseTableElement.fieldCount = xml.evaluate(
				`//FieldCatalog/BaseTableReference[@UUID='${uuid}']/following-sibling::ObjectList/@membercount`,
				xml, null, XPathResult.NUMBER_TYPE, null).numberValue;
			baseTableElement.occurrenceCount = xml.evaluate(
				`//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@UUID='${uuid}']/ancestor::TableOccurrence`,
				xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

			if (this.id) {
				const [fragment] = this.getFields(xml, baseTable);
				baseTableElement.append(fragment)
			}

			baseTable = baseTables.iterateNext();
		}

		return [
			headerHTML,
			html`<div id='container'><slot></slot></div>`
		]
	}

	getFields(xml, baseTable) {
		// get the uuid
		const uuid = baseTable.querySelector('UUID').textContent;
		// build xpath query
		const xpath = `//FieldCatalog/BaseTableReference[@UUID='${uuid}']/following-sibling::ObjectList/Field`;
		// get the fields
		const catalog = xml.evaluate(xpath, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		const catalogUntouched = xml.evaluate(xpath, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		let count = 0;
		// duplicate result object
		let item = catalog.iterateNext();
		const fragment = document.createDocumentFragment();
		while (item) {
			count++;
			// get the field name
			const fieldName = item.getAttribute('name');
			const field = document.createElement('fx-field');
			field.xml = item;
			fragment.append(field);
			item = catalog.iterateNext();
		}

		return [fragment, count, catalogUntouched];

	}


}

customElements.define('fx-table-page', TablePage);