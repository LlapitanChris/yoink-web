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
					<th>Color</th>
					<th>Top</th>
					<th>Left</th>
					<th>Width</th>
					<th>Height</th>
					<th>Mod Count</th>
					<th>Username</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const rowTemplate = (item) => {

			const coordRect = item.querySelector('CoordRect');
			const width = coordRect.getAttribute('right') - coordRect.getAttribute('left');
			const height = coordRect.getAttribute('bottom') - coordRect.getAttribute('top');


			return html`
				<tr>
					<td><fx-references-button .xmlNode=${item} label='R'></fx-references-button></td>
					<td @click=${route} href=${`/table-occurrence?id=${item.getAttribute('id')}`}>${item.getAttribute('name')}</td>
					<td>
						${item.querySelector('Color').getAttribute('red')},
						${item.querySelector('Color').getAttribute('green')},
						${item.querySelector('Color').getAttribute('blue')}
						${item.querySelector('Color').getAttribute('alpha')}
					</td>
					<td>${coordRect.getAttribute('top')}</td>
					<td>${coordRect.getAttribute('left')}</td>
					<td>${width}</td>
					<td>${height}</td>
					<td>${item.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${item.querySelector('UUID')?.getAttribute('userName')}</td>
					<td>${item.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${new Date(item.querySelector('UUID')?.getAttribute('timestamp')).toLocaleString()}</td>
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

customElements.define('fx-table-occurrence-page', TableOccurrencePage);