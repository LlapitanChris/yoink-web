import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';
import '../components/FxReferencesButton.js';

import { occurrencesTable } from '../utilities/tables.js';

const baseClass = FxDataPageMixin(LitElement);

export default class TableOccurrencePage extends baseClass {

	constructor() {
		super();
		this.id;
		this.tableId;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			display: { type: String, reflect: true },
			tableId: { type: String }
		}

	}

	get xpathString() {
		if (this.id) {
			return `//AddAction//TableOccurrenceCatalog/TableOccurrence[@id='${this.id}']`;
		} else if (this.baseTableId) {
			return `//AddAction//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@id='${this.baseTableId}']/ancestor::TableOccurrence`;
		} else {
			return `//AddAction//TableOccurrenceCatalog/TableOccurrence`;
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.id) {
			return html`<h1 slot='title'>Table Occurrence ${this.id}</h1>`;
		} else {
			return html`<h1 slot='title'>Table Occurrence List</h1>`;
		}
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl()

		const data = super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		
		return html`
			<fx-page>
				${this.headerTemplate()}
				${occurrencesTable(data)}
			</fx-page>
		`;

	}

}

customElements.define('fx-table-occurrence-page', TableOccurrencePage);