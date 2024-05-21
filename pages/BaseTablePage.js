import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { classMap } from 'https://cdn.skypack.dev/lit-html/directives/class-map';

// import sub components
import '../components/FxBaseTable.js';
import '../components/FxElementList.js';
import '../components/FxPage.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class TablePage extends baseClass {

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

		let headerHTML, baseTables;

		// get the XML
		if (this.id) {
			headerHTML = html`<h1 slot='title'>Base Table ${this.id}</h1>`;
			baseTables = super.xpath(`//BaseTable[@id="${this.id}"]`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		} else {
			headerHTML = html`<h1 slot='title'>Base Table List</h1>`;
			baseTables = super.xpath('//BaseTable', XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		}

		// create the base table(s) from the xml
		let baseTable = baseTables.iterateNext();
		const baseTablesTemplatesArray = [];
		while (baseTable) {
			const baseTableTemplate = html`
				<fx-base-table class='bordered' .xmlNode=${baseTable} .xmlDocument=${this.xmlDocument}></fx-base-table>`;
			baseTablesTemplatesArray.push(baseTableTemplate);
			baseTable = baseTables.iterateNext();
		}

		const classes = {
			grid: this.display === 'grid',
			flex: this.display === 'flex',
			list: this.display === 'list'
		}

		// return the template
		// render a page element with the header and put 
		// the base tables in an element list
		return html`
			<fx-page>
				${headerHTML}
				<fx-element-list class=${classMap(classes)}>
					${baseTablesTemplatesArray}
				</fx-element-list>
			</fx-page>
		`;

	}


}

customElements.define('fx-table-page', TablePage);