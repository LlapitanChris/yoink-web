import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxDataTable extends LitElement {

	createRenderRoot() {
		return this;

	}
	static get properties() {
		return {
			data: { type: Array },
			rowTemplate: { type: Function },
			columnsTemplate: { type: Function },
			columnGroupTemplate: { type: Function },
		}
	}
	static get styles() {
		return css`
			:host {
				display: contents;
				width: 100%;
				overflow: auto;
			}
		`;
	}

	constructor() {
		super();
		this._data = [];
	}

	render() {
		const options = { indentLevel: 0 };
		return html`
			<table part='table'>
				${ this.columnGroupTemplate ? this.columnGroupTemplate() :''}
				<thead>
						${this.columnsTemplate()}
				</thead>
				<tbody>
					${this.data.map((row) => this.rowTemplate(row, options))}
				</tbody>
			</table>
		`;

	}

	set data(value) {
		if (!value) {
			console.error('Data must be an array or XPathResult');
			return;
		}
		// if we get an xpathresult, convert it to an array
		let data;
		if (value.constructor.name === 'XPathResult') {
			let item = value.iterateNext();
			data = [];
			while (item) {
				data.push(item);
				item = value.iterateNext();
			}
		} else if (value.constructor.name === 'Array') {
			data = value;
		} else {
			throw new Error('Data must be an array or XPathResult');
		}

		this._data = data;
	}

	get data() {
		return this._data;
	}

}

customElements.define('fx-data-table', FxDataTable);