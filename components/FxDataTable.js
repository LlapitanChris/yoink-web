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
			groupData: { type: Array }
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
		let rows;
		if (this.groupData) {
			// if we have group data, render the group data,
			// each should have it's own tBody element
			rows = this.groupData.map(group => group.templateFunction(group.data, options));
		} else {
			// if we don't have group data, render the rows INSIDE a tbody
			rows = html`
			<tbody>
				${this.data.map((row) => this.rowTemplate(row, options))}
			</tbody>
			`;
		}
		return html`
			<table>
				${ this.columnGroupTemplate ? this.columnGroupTemplate() :''}
				<thead>
						${this.columnsTemplate()}
				</thead>
				${rows}
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


	set groupData(value) {

		// ensure that the data is an array
		if (!Array.isArray(value) ||
			!value.every(item => item.constructor.name === 'Object') ||
			!value.length > 0) {
			console.trace('Data must be an array of group data objects', value);
			return;
		}

		// ensure each object is valid
		if (!value.every(item => item.hasOwnProperty('data') && item.hasOwnProperty('templateFunction'))) {
			console.error('Data must be an array of group data objects. Each object must have a data property and a templateFunction property.', value, item);
			return;
		}

		this._groupData = value;

		for (const group of this._groupData) {
			// convert the data to an array if it's an xpathresult
			if (group.data.constructor.name === 'XPathResult') {
				let item = group.data.iterateNext();
				const data = [];
				while (item) {
					data.push(item);
					item = group.data.iterateNext();
				}
				group.data = data;
			}
		}



	}

	get groupData() {
		return this._groupData;
	}

}

customElements.define('fx-data-table', FxDataTable);