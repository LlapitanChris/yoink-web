import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { classMap } from 'https://cdn.skypack.dev/lit-html/directives/class-map';

// import sub components
import '../components/FxBaseTable.js';
import '../components/FxElementList.js';
import '../components/FxPage.js';
import '../components/FxDataTable.js';
import '../components/FxReferencesButton.js'

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class TablePage extends baseClass {

	constructor() {
		super();
		this.id;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			display: { type: String, reflect: true },
		}

	}

	createRenderRoot() {
		return this;
	}


	render() {
		// get parameters from url
		super.setPropsFromUrl();

		let headerHTML, baseTables;

		// get the XML
		if (this.id) {
			headerHTML = html`<h1 slot='title'>Base Table ${this.id}</h1>`;
			baseTables = super.xpath(`//BaseTable[@id="${this.id}"]`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		} else {
			headerHTML = html`<h1 slot='title'>Base Table List</h1>`;
			baseTables = super.xpath('//BaseTable', XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		}

		// create colgroup template
		const colgroupTemplate = () => {
			return html`
			<colgroup>
				<col style='width: 50px'></col>
				<col style='width: 200'></col>
				<col style='width: 100px'></col>
				<col style='width: 100px'></col>
				<col style='width: 100px'></col>
				<col style='width: 100px'></col>
				<col style='width: 200px'></col>
			</colgroup>
		`;
		}

		// create a table of the data
		const columnsTemplate = () => {
			return html`
				<tr>
					<th></th>
					<th>Base Table</th>
					<th>Field Count</th>
					<th>Mod Count</th>
					<th>Username</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const rowTemplate = (baseTable) => { 
			const id = baseTable.getAttribute('id');
			const uuid = baseTable.querySelector('UUID').textContent;
			const fieldCount = super.xpath(`(//FieldsForTables//BaseTableReference[@id="${id}"]/following-sibling::ObjectList/@membercount)`, XPathResult.NUMBER_TYPE).numberValue;

			return html`
				<tr>
					<td><fx-references-button .xmlNode=${baseTable} label='R'></fx-references-button></td>
					<td @click=${route} href=${`/table?id=${id}`}>${baseTable.getAttribute('name')}</td>
					<td @click=${route} href=${`/field?tableId=${id}&showReferences=true`}>${fieldCount}</td>
					<td>${baseTable.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${baseTable.querySelector('UUID')?.getAttribute('userName')}</td>
					<td>${baseTable.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${new Date(baseTable.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
				</tr>
			`;
		}

		const tableData = html`
			<fx-data-table
			.data=${baseTables} 
			.columnsTemplate=${columnsTemplate} 
			.rowTemplate=${rowTemplate}
			.columnGroupTemplate=${colgroupTemplate}></fx-data-table>
		`;

		const detailViewTemplate = () => { 
			return html`
				<fx-base-table .xmlNode=${baseTables.iterateNext()} .xmlDocument=${this.xmlDocument}></fx-base-table>
			`;
		
		}

		return html`
			<fx-page>
				${headerHTML}
				${this.id ? detailViewTemplate() : tableData}
			</fx-page>
		`;

	}


}

customElements.define('fx-table-page', TablePage);