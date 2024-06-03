import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';
import '../components/FxReferencesButton.js';

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
					<th>Color</th>
					<th>T/L</th>
					<th>W/H</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const columnGroupTemplate = () => {
			return html`
				<colgroup>
					<col style='width: 50px'></col>
					<col style='width: 100%'></col>
					<col style='width: 50px'></col>
					<col style='width: 15ch'></col>
					<col style='width: 15ch'></col>
					<col style='width: 5ch'></col>
					<col style='width: 200px'></col>
					<col style='width: 200px'></col>
					`
		}

		const rowTemplate = (item) => {

			const coordRect = item.querySelector('CoordRect');
			const width = coordRect.getAttribute('right') - coordRect.getAttribute('left');
			const height = coordRect.getAttribute('bottom') - coordRect.getAttribute('top');
			const r = item.querySelector('Color').getAttribute('red');
			const g = item.querySelector('Color').getAttribute('green');
			const b = item.querySelector('Color').getAttribute('blue');

			const userName = item.querySelector('UUID')?.getAttribute('userName');
			const accountName = item.querySelector('UUID')?.getAttribute('accountName');

			return html`
				<tr>
					<td><fx-references-button .xmlNode=${item} label='R' class='very-small'></fx-references-button></td>
					<td @click=${route} href=${`/table-occurrence?id=${item.getAttribute('id')}`}>${item.getAttribute('name')}</td>
					<td>
						<div class='color' style='width: 10px; height: 10px; background-color: rgb(${r}, ${g}, ${b})'></div>
					</td>
					<td>[${coordRect.getAttribute('top')}, ${coordRect.getAttribute('left')}]</td>
					<td>${width} x ${height}</td>
					<td>${item.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td title=${userName}>${accountName}</td>
					<td>${new Date(item.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
				</tr>
			`;
		}

		const dataTableTemplate = html`
			<fx-data-table
				.data=${super.xpath(this.xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE)} 
				.columnGroupTemplate=${columnGroupTemplate}
				.columnsTemplate=${columnHeaderTemplate} 
				.rowTemplate=${rowTemplate}
			></fx-data-table>
		`;

		return html`
			<fx-page>
				${this.headerTemplate()}
				${dataTableTemplate}
			</fx-page>
		`;

	}

}

customElements.define('fx-table-occurrence-page', TableOccurrencePage);