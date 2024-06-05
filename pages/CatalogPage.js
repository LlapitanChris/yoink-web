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
					<th>Items</th>
					<th>Mod</th>
					<th>Account</th>
					<th>Timestamp</th>
				</tr>
			`;
		}

		const columnGroupTemplate = () => { 
			return html`
				<colgroup>
					<col></col>
					<col style='width: 6ch'></col>
					<col style='width: 6ch'></col>
					<col style='width: 200px'></col>
					<col style='width: 200px'></col>
				</colgroup>
				`;
		}

		// create the table row template
		const rowTemplate = (catalog) => {

			const name = catalog.nodeName;
			const nameKebabCase = name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).slice(1);
			// remove the 'Catalog' from the name
			const nameClean = nameKebabCase.replace('-catalog', '');

			return html`
				<tr>
					<td><a @click=${route} href=${`/${nameClean}`}>${catalog.nodeName}</a></td>
					<td>${
						catalog.nodeName == 'FileAccessCatalog' ?
						catalog.querySelector('ObjectList').getAttribute('membercount') :
						catalog.getAttribute('membercount')
					}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('modifications')}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('accountName')}</td>
					<td>${catalog.querySelector('UUID')?.getAttribute('timestamp')}</td>
				</tr>
			`;
		}

		// create the table
		const dataTableTemplate = html`
			<fx-data-table
			.data=${catalogs} 
			.columnsTemplate=${columnsTemplate} 
			.rowTemplate=${rowTemplate}
			.columnGroupTemplate=${columnGroupTemplate}>
			</fx-data-table>
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
