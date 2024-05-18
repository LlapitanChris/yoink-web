import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

// import the task from CDN
import { Task } from 'https://cdn.skypack.dev/@lit-labs/task';

// import XML to HTML utility
import { XmlToHtml } from '../utilities/XsltHelper.js'

// import sub components
import '../components/FxBaseTable.js';
import '../components/FxBaseTableDetail.js';

export default class TablePage extends LitElement {

	constructor() {
		super();
		this.fragment;
		this.id;
	}

	static get properties() {
		return {
			id: { type: String },
			fragment: { type: Object }
		}

	}



	render() {
		let headerHTML;
		if (this.id) {
			headerHTML = html`<h1>Table ${this.id}</h1>`;

		} else {
			headerHTML = html`<h1>Table List</h1>`;
		}
		return this.loadingTask.render({
			pending: () => [headerHTML, html`<p>Loading...</p>`],
			complete: (fragment) => {
				this.replaceChildren(fragment);
				return [headerHTML, html`<slot></slot>`]
			},
			error: (error) => [headerHTML, html`Error: <p>${error}</p>`]
		})
	}

	loadingTask = new Task(this, {
		task: async () => {
			// get query params from the URL
			const url = new URL(window.location.href);
			const searchParams = url.searchParams;
			// get the id param
			const id = searchParams.get('id');
			this.id = id;

			const pathToXml = '../../test_data/Yoink 05-17-24.xml';
			const pathToXslt = id ? '../../xslt/BaseTableDetail.xsl' : '../../xslt/BaseTable.xsl';
			const fragment = await XmlToHtml(pathToXml, pathToXslt);
			this.fragment = fragment;
			console.log('Fragment', fragment)

			if (id) {
				try {
					const table = fragment.querySelector(`fx-base-table-detail[id="${id}"]`);
					if (table) {
						return table;
					} else {
						throw new Error(`Table with id ${id} not found`);
					}
				} catch (error) {
					console.error(error);
					throw error;
				}
			}
			return fragment;
		},
		args: () => []

	})

}

customElements.define('fx-table-page', TablePage);