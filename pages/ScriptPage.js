import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';

const baseClass = FxDataPageMixin(LitElement);

export default class FxScriptPage extends baseClass {

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

	get xpathString() {
		if (this.id) {
			return `//AddAction//ScriptCatalog/Script[@id='${this.id}']`;
		} else {
			return `//AddAction//ScriptCatalog/Script`;
		}

	}

	// define header template,
	// this will be called by the mixin render function
	headerTemplate() {
		if (this.id) {
			return html`<h1 slot='title'>Script ${this.id}</h1>`;
		} else {
			return html`<h1 slot='title'>Script List</h1>`;
		}
	}

	render() {
		// get parameters from url
		super.setPropsFromUrl();




		if (this.id) {
			const item = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
			return html`
				<fx-page>
					${this.headerTemplate()}
					<div>
						<p>${item.getAttribute('name')}: ${item.getAttribute('id')}</p>
					</div>
				</fx-page>
			`;
		}

		const columnHeaderTemplate = () => {
			return html`
				<tr>
					<th></th>
					<th>Name</th>
					<th>Id</th>
					<th>Folder</th>
					<th>Modifications</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const columnGroupTemplate = () => { 
			return html`
				<colgroup>
					<col style='width: 50px'></col>
					<col style='width: 300'></col>
					<col style='width: 6ch'></col>
					<col style='width: 8ch'></col>
					<col style='width: 6ch'></col>
					<col style='width: 200px'></col>
					<col style='width: 200px'></col>
				</colgroup>`;
		}

		const rowTemplate = (item) => {

			const type = item.getAttribute('isFolder')
			const uuid = item.querySelector('UUID')?.textContent || item.getAttribute('UUID');
			return html`
				<tr>
					<td><button @click=${route} href=${`/reference?uuid=${uuid}&type=ScriptReference`}>R</button></td>
					<td @click=${route} href=${`/script-step?scriptId=${item.getAttribute('id')}`}>${item.getAttribute('name')}</td>
					<td>${item.getAttribute('id')}</td>
					<td>${type == 'True' ? 'Folder' : type}</td>
					<td>${item.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${item.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${new Date(item.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
				</tr>
			`;
		}

		const dataTableTemplate = html`
			<fx-data-table
			.data=${super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE)} 
			.columnsTemplate=${columnHeaderTemplate} 
			.rowTemplate=${rowTemplate}
			.columnGroupTemplate=${columnGroupTemplate}>
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

customElements.define('fx-script-page', FxScriptPage);