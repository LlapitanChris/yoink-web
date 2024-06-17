import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { externalDataSourcesTable } from '../utilities/tables.js';


// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class CustomFunctionPage extends baseClass {

	render() {
		// get parameters from url
		super.setPropsFromUrl();

		this.headerTemplate = html`<h1 slot='title'>Custom Functions</h1>`;
		this.tableData = super.xpath('//AddAction/CustomFunctionsCatalog//CustomFunction');
		this.tableTemplate = externalDataSourcesTable;

		// call the mixin render function
		return super.render();
	}
}

customElements.define('custom-function-page', CustomFunctionPage);