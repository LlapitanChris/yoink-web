import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';

const baseClass = FxDataPageMixin(LitElement);

export default class FileAccessPage extends baseClass {

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
			return `//AddAction//FileAccessCatalog/ObjectList/Authorization[@id='${this.id}']`;
		} else {
			return `//AddAction//FileAccessCatalog/ObjectList/Authorization`;
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.id) {
			return html`<h1 slot='title'>Authorization ${this.id}</h1>`;
		} else {
			return html`<h1 slot='title'>File Access List</h1>`;
		}
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl();

		if (this.id) {
			const item = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
			
			const name = item.querySelector('Display').textContent;
			const id = item.getAttribute('id');


			return html`
				<fx-page>
					${this.headerTemplate()}
					<div>
						<p>${name}: ${id}</p>
					</div>
				</fx-page>
			`;
		}

		const columnHeaderTemplate = () => { 
			return html`
				<tr>
					<th>Name</th>
					<th>Added</th>
					<th>By</th>
					<th>Mod Count</th>
					<th>Username</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const rowTemplate = (field) => { 
			const id = field.getAttribute('id');
			const source = field.querySelector('Source');
			const addedAt = source.getAttribute('CreationTimestamp');
			return html`
				<tr>
				<td @click=${route} href=${`/file-access?id=${id}`}>${field.querySelector('Display').textContent}</td>
					<td>${new Date(addedAt).toLocaleString()}</td>
					<td>${source.getAttribute('CreationAccountName')}</td>
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

customElements.define('fx-file-access-page', FileAccessPage);