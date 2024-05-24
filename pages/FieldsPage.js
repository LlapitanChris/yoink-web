import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxField.js';
import '../components/FxDataTable.js';

const baseClass = FxDataPageMixin(LitElement);

export default class FieldsPage extends baseClass {

	constructor() {
		super();
		this.uuid;
		this.tableId;
		this.display = 'list'
	}

	static get properties() {
		return {
			uuid: { type: String },
			display: { type: String, reflect: true },
			tableId: { type: String }
		}

	}

	get xpathString() {
		if (this.uuid) {
			return `//AddAction//FieldCatalog/ObjectList/Field/UUID[text()='${this.uuid}']/parent::Field`;
		} else if (this.tableId) {
			return `//AddAction//FieldCatalog/BaseTableReference[@id='${this.tableId}']/following-sibling::ObjectList/Field`;
		} else {
			return '//AddAction//FieldCatalog/ObjectList/Field';
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.uuid) {
			return html`<h1 slot='title'>Field ${this.uuid}</h1>`;
		} else if (this.tableId) {
			return html`<h1 slot='title'>Field List for Table ${this.tableId}</h1>`;
		} else {
			return html`<h1 slot='title'>Field List</h1>`;
		}
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl();

		if (this.uuid) {
			const field = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
			return html`
				<fx-page>
					${this.headerTemplate()}
					<fx-field .xmlNode=${field} .xmlDocument=${this.xmlDocument}></fx-field>
				</fx-page>
			`;
		}

		const columnHeaderTemplate = () => { 
			return html`
				<tr>
					<th>Table</th>
					<th>Field</th>
					<th>Mod Count</th>
					<th>Username</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const rowTemplate = (field) => { 
			const tableRef = field.parentElement.parentElement.querySelector('BaseTableReference');
			const tableName = tableRef.getAttribute('name');
			const tableId = tableRef.getAttribute('id');
			const id = field.getAttribute('id');
			return html`
				<tr>
					<td @click=${route} href=${`/table?id=${tableId}`}>${tableName}</td>
					<td @click=${route} href=${`/field?id=${id}`}>${field.getAttribute('name')}</td>
					<td>${field.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${field.querySelector('UUID')?.getAttribute('userName')}</td>
					<td>${field.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${new Date(field.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
				</tr>
			`;
		} 

		const dataTableTemplate = html`
			<fx-data-table .data=${super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE)} .columnsTemplate=${columnHeaderTemplate} .rowTemplate=${rowTemplate}></fx-data-table>
		`;

		return html`
			<fx-page>
				${this.headerTemplate()}
				${dataTableTemplate}
			</fx-page>
		`;
		
	}




}

customElements.define('fx-field-page', FieldsPage);