import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { xpath, xpathResultToArray } from '../utilities/xpath.js';
import * as table from '../utilities/tables.js';
import { camelCaseFromKebab, pascalCaseFromKebab, kebabToProperName } from '../utilities/text.js';


// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class TablePage extends baseClass {

	static config = {
		'/catalog': {
			title: 'All Catalogs',
			xpath: `//AddAction/*[substring(name(), string-length(name()) - string-length('Catalog') +1) = 'Catalog']`,
		},
		'/custom-functions': {
			title: 'Custom Function List',
			xpath: `//AddAction/CustomFunctionsCatalog/ObjectList/CustomFunction`,
		},
		'/file-access': {
			title: 'File Access List',
			xpath: `//AddAction//FileAccessCatalog/ObjectList/Authorization`,
		},
		'/privilege-sets': {
			title: 'Privilege Set List',
			xpath: `//AddAction//PrivilegeSetsCatalog/ObjectList/PrivilegeSet`,
		},
		'/extended-privileges': {
			title: 'Extended Privilege List',
			xpath: `//AddAction//ExtendedPrivilegesCatalog/ObjectList/ExtendedPrivilege`,
		},
		'/accounts': {
			title: 'Account List',
			xpath: `//AddAction//AccountsCatalog/ObjectList/Account`,
		}
	}


	render() {

		// get url path
		const path = window.location.pathname;

		// convert the path to camel case, with the first letter lowercase
		// don't include the first slash
		const camelCasePath = camelCaseFromKebab(path.replace('/', ''));
		const pascalCasePath = pascalCaseFromKebab(path.replace('/', ''));
		const properName = kebabToProperName(path.replace('/', ''));

		// get config data for the path
		const xpath = TablePage.config[path]?.xpath || `//AddAction//${pascalCasePath}Catalog/${pascalCasePath}`;
		const title = TablePage.config[path]?.title || properName + ' List';
		const data = super.xpath(xpath, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

		console.assert(data, 'No data found for path', path, 'with xpath', xpath);
		console.assert(data.length, 'No data found for path', path, 'with xpath', xpath);

		const importName = `${camelCasePath}Table`;
		const tableTemplate = table[importName] || table['defaultTable'];

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