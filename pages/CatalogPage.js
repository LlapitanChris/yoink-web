import {LitElement, html} from 'https://cdn.skypack.dev/lit-element';
import { FxDataPageMixin } from "../mixins/FxDataPageMixin.js";
import '../components/FxDataTable.js';

export default class CatalogPage extends FxDataPageMixin(LitElement) { 
	
	constructor() {
		super();
		this.display = 'list'
	}

	static get properties() {
		return {
			display: { type: String, reflect: true },
		}

	}

	createRenderRoot() {
		return this;
	}

	render() {
		// get catalogs list from xml
		const xpathString = `//AddAction/*[substring(name(), string-length(name()) - string-length('Catalog') +1) = 'Catalog']`;
		const catalogs = super.xpath(xpathString, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

		// create the table header row template
		const columnsTemplate = () => {
			return html`
				<tr>
					<th>Catalog</th>
					<th>Member Count</th>
					<th>Mod Count</th>
					<th>Username</th>
					<th>Account Name</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		// create the table row template
		const rowTemplate = (catalog) => {
			return html`
				<tr>
					<td>${catalog.nodeName}</td>
					<td>${
						catalog.nodeName == 'FileAccessCatalog' ?
						catalog.querySelector('ObjectList').getAttribute('membercount') :
						catalog.getAttribute('membercount')
					}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('userName')}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('timestamp')}</td>
				</tr>
			`;
		}

		// create the table
		const dataTableTemplate = html`
			<fx-data-table .data=${catalogs} .columnsTemplate=${columnsTemplate} .rowTemplate=${rowTemplate}></fx-data-table>
		`;

		// return the page
		return html`
			<fx-page>
				<h1 slot='title'>Catalogs</h1>
				${dataTableTemplate}
			</fx-page>
		`;
	}
}
customElements.define('fx-catalog-page', CatalogPage);
