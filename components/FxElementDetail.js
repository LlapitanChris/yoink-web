import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import './FxDataTable.js';
import { fieldsTable, occurrencesTable } from '../utilities/tables.js';
import { xpath, xpathResultToArray } from '../utilities/xpath.js';

export default class FxElementDetail extends LitElement {

	static get properties() {
		return {
			node: { type: Object },
			xmlDocument: { type: Object },
			name: { type: String, reflect: true },
			uuid: { type: String, reflect: true },
			fmId: { type: String, reflect: true, attribute: 'fm-id' },
			type: { type: String, reflect: true },
		}
	}

	static get styles() {
		return css`

		:host {
			box-sizing: border-box;
		}

		.footer {
			border-top: 1px solid #ccc;
			margin-top: 1em;
		}

		.footer > label {
			margin-right: 1em;
			margin-top: 1em;
		}

		.content {
			padding: 1em;
			border: 1px solid #ccc;
			border-radius: 5px;
			margin-top: 1em;
		}

		.content-block > label {
			display: block;
		}

		fx-data-table table {
			width: 100%;
			table-layout: fixed;
		}

		fx-data-table th {
			text-align: left;
		}

		fx-data-table td,
		fx-data-table th {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		section.content-block {
			padding-top: 1em;
			position: relative;

		}

		h2.section-title {
			position: sticky;
			top: 0;
			background-color: white;
			z-index: 100;
			padding-bottom: 1rem;
			width: 100%;
			border-bottom: 1px solid #ccc;
		}


		div.footer {
			border-top: 1px solid #ccc;
			margin-top: 1em;
			padding-top: 1em;
			position: sticky;
			bottom: 0;
			background-color: white;
		}

		`;
	}

	set node(value) {
		this._node = value;
		this.type = value.nodeName;
		this.fmId = value.id
		this.name = this.getName(value);
		this.uuid = this.getUuid(value);
	}

	get node() {
		return this._node;
	}

	getName(node) {
		const type = node.nodeName;
		switch (type) {
			case 'Script':
				return node.querySelector('ScriptReference').getAttribute('name');
			case 'Step':
				return node.closest('Script').querySelector('ScriptReference').getAttribute('name') ||
					node.closest('LayoutObject').querySelector('UUID').textContent;
			case 'LayoutObject':
				const bounds = node.querySelector('Bounds');
				return node.getAttribute('name') ||
					`[${bounds.getAttribute('top')},${bounds.getAttribute('left')},${bounds.getAttribute('bottom')},${bounds.getAttribute('right')}]`
			default:
				const name = node.getAttribute('name') || node.nodeName;
				const id = node.getAttribute('id');
				if (name) {
					return `${name} (${id})`;
				} else {
					return `(${id})`;
				}


		}

	}

	getUuid(node) {
		return node.querySelector('UUID')?.textContent || node.getAttribute('UUID') || 'no UUID';
	}

	render() {
		// because we're saving the function to constant, we'll need to re-bind 'this' to the function
		const renderFunction = this[`render${this.type}`] || this.renderDefault;

		return html`
			<div class='content'>
				${renderFunction.call(this)}
			</div>
			<div class='footer'>
				${this.renderUuid()}
			</div>
		`;
	}

	renderDefault() {

		return html`
			<p>${this.type}</p>
			<p>${this.name}</p>
		`;
	}

	renderUuid() {
		const uuidNode = this.node.querySelector('UUID');
		return html`
			<label>UUID: <span>${this.uuid ? this.uuid : 'no UUID'}</span></label>
			<label>Modified: <span>${uuidNode ? new Date(uuidNode.getAttribute('timestamp')).toLocaleString() : 'no timestamp'}</span></label>
			<label>Account: <span>${uuidNode ? uuidNode.getAttribute('accountName') : 'no account name'}</span></label>
		`;
	}

	renderBaseTable() {
		const resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
		const fields = xpath(`//AddAction//FieldCatalog/BaseTableReference[@id='${this.fmId}']/following-sibling::ObjectList/Field`, resultType);

		const occurrences = xpath(`//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@id='${this.fmId}']/ancestor::TableOccurrence`, resultType,);


		return html`
			<section class='content-block'>
				<h2 class='section-title'>Table Info</h2>
				<label>Type: <span>${this.type}</span></label>
				<label>Name: <span>${this.name}</span></label>
				<label>Fields: <a href="#fields"><span>${fields.length}</span></a></label>
				<label>Occurrences: <a href="#occurrences"><span>${occurrences.length}</span></a></label>
			</section>
			<section class='content-block'>
				<h2 id='fields' class='section-title'>Fields: <span>${fields.length}</span></h2>
				${fieldsTable(fields)}
			</section>
			<section id='occurrences' class='content-block'>
				<h2 class='section-title'>Occurrences: <span>${occurrences.length}</span></h2>
				${occurrencesTable(occurrences)}
			</section>
		`;

	}

}


customElements.define('fx-element-detail', FxElementDetail);