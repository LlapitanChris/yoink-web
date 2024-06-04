import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import '../components/FxDataTable.js'
import '../components/FxReferencesButton.js'

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class LayoutPage extends baseClass {
	static get styles() {
		return css``;
	}

	static get properties() {
		return {
			id: { type: String },
			tableId: { type: String },
		}
	}

	constructor() {
		super();
		// initialize properties here
	}

	get xpathString() {
		if (this.id) {
			return `//AddAction//LayoutCatalog/Layout[@id='${this.id}']`;
		} else {
			return `//AddAction//LayoutCatalog/Layout`;
		}
	}

	get nodes() {
		const nodes = super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		const array = [];
		// convert to array
		let node = nodes.iterateNext()
		while (node) {
			array.push(node)
			node = nodes.iterateNext()
		}

		return array;
	}

	render() {

		super.setPropsFromUrl();

		// generate the header
		let headerHTML;
		if (this.id) {
			headerHTML = html`<h1 slot='title'>Layout ${this.id}</h1>`;
		}
		else {
			headerHTML = html`<h1 slot='title'>Layout List</h1>`;
		}

		// we'll handle the id later

		// default list
		const headerColumns = () => {
			return html`
			<tr>
				<th></th>
				<th>name</th>
				<th>id</th>
				<th>context</th>
				<th>parts</th>
				<th>mod</th>
				<th>account</th>
				<th>timestamp</th>
			</tr>
			`;
		}

		// column group template
		const colgroupTemplate = () => { 
			return html`
			<colgroup>
				<col style='width: 50px'></col>
				<col style='width: 200'></col>
				<col style='width: 6ch'></col>
				<col style='width: 200px'></col>
				<col style='width: 6ch'></col>
				<col style='width: 6ch'></col>
				<col style='width: 20ch'></col>
				<col style='width: 20ch'></col>

			</colgroup>
			`;
		}

		const rowTemplate = (item) => {
			const id = item.id
			const name = item.getAttribute('name')
			const uuidNode = item.querySelector(':scope > UUID')
			const uuid = uuidNode?.textContent || ''
			const modCount = uuidNode.getAttribute('modifications') || 0;
			const account = uuidNode.getAttribute('accountName') || '';
			const timestamp = uuidNode.getAttribute('timestamp') || ''; // 2022-06-23T20:43:03
			const timestampFormatted = new Date(timestamp).toLocaleString();

			const tableName = item.querySelector('TableOccurrenceReference')?.getAttribute('name') || ''
			const partCount = item.querySelector('PartsList')?.getAttribute('membercount') || 0

			return html`
				<tr id=${uuid}>
					<td><fx-references-button
					.xmlNode=${item} 
					label='r'
					class='very-small'></fx-references-button></td>
					<td>${name}</td>
					<td>${id}</td>
					<td>${tableName}</td>
					<td>${partCount}</td>
					<td>${modCount}</td>
					<td>${account}</td>
					<td>${timestampFormatted}</td>
				</tr>
			`;
		}

		const tableTemplate = html`
			<fx-data-table
			.columnsTemplate=${headerColumns}
			.data=${this.nodes}
			.rowTemplate=${rowTemplate}
			.columnGroupTemplate=${colgroupTemplate}
			></fx-data-table>
		`;

		return html`
		<fx-page>
			${headerHTML}
			${tableTemplate}
		</fx-page>
		`;

	}
}

customElements.define('layout-page', LayoutPage);