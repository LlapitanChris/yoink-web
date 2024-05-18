import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { Task } from 'https://cdn.skypack.dev/@lit-labs/task';

// import XML to HTML utility
import { XmlToHtml } from '../utilities/XsltHelper.js'

// import sub components
import '../components/FxBaseTable.js';
import '../components/FxBaseTableDetail.js';

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
			baseTables = [xml.querySelector(`BaseTable[id="${this.id}"`)];

		} else {
			headerHTML = html`<h1>Base Table List</h1>`;
			baseTables = Array.from(xml.querySelectorAll(`BaseTable`));
		}

		// create the base tables
		baseTables.forEach((baseTable) => {
			const fxBaseTable = document.createElement('fx-base-table');
			fxBaseTable.xml = baseTable;
			this.append(fxBaseTable);
		});

		return [
			headerHTML,
			html`<slot></slot>`
		]
	}


}

customElements.define('fx-table-page', TablePage);