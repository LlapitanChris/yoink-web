import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';
import '../components/FxAnchor.js';
import '../components/FxReferencesButton.js';

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
					<th></th>
					<th>Name</th>
					<th>Added</th>
					<th>By</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const colgroupTemplate = () => { 
			return html`
				<colgroup>
					<col style='width: 50px'></col>
					<col></col>
					<col style='width: 200px'></col>
					<col style='width: 200px'></col>
					<col style='width: 6ch'></col>
					<col style='width: 200px'></col>
					<col style='width: 200px'></col>
				</colgroup>
			`;
		}

		const rowTemplate = (access) => { 
			const id = access.getAttribute('id');
			const uuid = access.querySelector('UUID').textContent;
			const source = access.querySelector('Source');
			const addedAt = source.getAttribute('CreationTimestamp');
			return html`
				<tr>
					<td>
						<fx-references-button .xmlNode=${access}>R</fx-references-button>
					</td>
					<td><fx-a href="/detail?uuid=${uuid}">${access.querySelector('Display').textContent}</fx-a></td>
					<td>${new Date(addedAt).toLocaleString()}</td>
					<td>${source.getAttribute('CreationAccountName')}</td>
					<td>${access.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${access.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${new Date(access.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
				</tr>
			`;
		} 

		const dataTableTemplate = html`
			<fx-data-table
			.data=${super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE)} 
			.columnsTemplate=${columnHeaderTemplate} 
			.rowTemplate=${rowTemplate}
			.columnGroupTemplate=${colgroupTemplate}>
			</fx-data-table>
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