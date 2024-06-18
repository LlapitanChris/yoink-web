import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';
import { xpath, xpathResultToArray } from '../utilities/xpath.js';
import { externalDataSourcesTable } from '../utilities/tables.js';


// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class ExternalDataSourcePage extends baseClass {

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

	createRenderRoot() {
		return this;
	}


	render() {
		// get parameters from url
		super.setPropsFromUrl();

		// get the XML

		const headerHTML = html`<h1 slot='title'>External Data Sources</h1>`;
		const baseTableArray = super.xpath('//ExternalDataSourceCatalog/ExternalDataSource');
		return html`
			<fx-page>
				${headerHTML}
				${externalDataSourcesTable(baseTableArray)}
			</fx-page>
		`;


	}

}

customElements.define('external-data-source-page', ExternalDataSourcePage);