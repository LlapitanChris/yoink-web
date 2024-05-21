import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { classMap } from 'https://cdn.skypack.dev/lit-html/directives/class-map';



// import sub components
import '../components/FxBaseTable.js';
import '../components/FxField.js';
import '../components/FxElementList.js';

export default class TablePage extends LitElement {

	constructor() {
		super();
		this.fragment;
		this.id;
		this.xml;
		this.display = 'list'
	}

	static get properties() {
		return {
			id: { type: String },
			fragment: { type: Object },
			display: { type: String, reflect: true },
		}

	}

	createRenderRoot() {
		return this;
	}


	render() {
		// get id from url
		const url = new URL(window.location);
		this.id = url.searchParams.get('id');

		// get the parent
		const parent = this.closest('fx-app');
		const xml = parent.xml;

		// add page class
		this.classList.add('page');


		let headerHTML, baseTables;

		if (this.id) {
			headerHTML = html`<h1 class='page-title'>Base Table ${this.id}</h1>`;
			baseTables = xml.evaluate(`//BaseTable[@id="${this.id}"]`, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		} else {
			headerHTML = html`<h1 class='page-title'>Base Table List</h1>`;
			baseTables = xml.evaluate('//BaseTable', xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		}


		// create the base tables from the xml
		let baseTable = baseTables.iterateNext();
		const baseTablesTemplatesArray = [];
		while (baseTable) {
			const baseTableTemplate = html`
				<fx-base-table class='bordered' .xmlNode=${baseTable} .xmlDocument=${xml}></fx-base-table>`;
			baseTablesTemplatesArray.push(baseTableTemplate);
			baseTable = baseTables.iterateNext();
		}

		const classes = {
			'grid': this.display === 'grid',
			'flex': this.display === 'flex',
			'list': this.display === 'list'
		}

		return html`
			${headerHTML}
			<fx-element-list class="${classMap(classes)}">
				${baseTablesTemplatesArray}
			</fx-element-list>
		
		`;

	}


}

customElements.define('fx-table-page', TablePage);