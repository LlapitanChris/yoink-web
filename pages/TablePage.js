import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { xpath, xpathResultToArray } from '../utilities/xpath.js';
import * as table from '../utilities/tables.js';


// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class TablePage extends baseClass {

	static config = {
		'/catalogs': {
			title: 'Catalogs',
			xpath: `//AddAction/*[substring(name(), string-length(name()) - string-length('Catalog') +1) = 'Catalog']`,
		},
		'/value-list': {
			title: 'Value Lists',
			xpath: `//AddAction//ValueListCatalog/ValueList`,
		},
		'/custom-functions': {
			title: 'Custom Functions',
			xpath: `//AddAction/CustomFunctionsCatalog/ObjectList/CustomFunction`,
		},
		'/base-table': {
			title: 'Base Tables',
			xpath: `//AddAction/BaseTableCatalog/BaseTable`,
		},
	}


	render() {

		// get url path
		const path = window.location.pathname;

		// get config data for the path
		const xpath = TablePage.config[path].xpath;
		const title = TablePage.config[path].title;
		const data = super.xpath(xpath, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

		// convert the path to camel case, with the first letter lowercase
		const camelCasePath = path.replace('/', '').split('-').reduce((acc, part, index) => {
			if (index === 0) {
				return part.toLowerCase();
			} else {
				return acc + part[0].toUpperCase() + part.slice(1);
			}
		});

		const importName = `${camelCasePath}Table`;
		const tableTemplate = table[importName];
		const boundTemplate = tableTemplate.bind(this);

		if (!tableTemplate) {
			throw new Error(`No table template found for ${importName}`);
		}

		const headerHTML = html`<h1 slot='title'>${title}</h1>`;
		return html`
			<fx-page>
				${headerHTML}
				${boundTemplate(data)}
			</fx-page>
		`;

	}

}

customElements.define('table-page', TablePage);