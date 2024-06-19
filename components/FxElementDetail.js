import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import './FxDataTable.js';
import './FxAnchor.js';

import * as tables from '../utilities/tables.js';
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

		.content-block label {
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
			display: flex;
			flex-direction: column;
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

		.flex-row {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		.flex-column {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.rounded {
			border-radius: 5px;
			border: 1px solid #ccc;
			padding: 1rem;
		}

		fx-a {
			padding: 0;
			margin: 0;
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

	// Base Table
	renderBaseTable() {
		const resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
		const fields = xpath(`//AddAction//FieldCatalog/BaseTableReference[@UUID='${this.uuid}']/following-sibling::ObjectList/Field`, resultType, this.xmlDocument);
		const occurrences = xpath(`//TableOccurrenceCatalog//BaseTableSourceReference/BaseTableReference[@UUID='${this.uuid}']/ancestor::TableOccurrence`, resultType, this.xmlDocument);


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
				${tables.fieldsTable(fields)}
			</section>
			<section id='occurrences' class='content-block'>
				<h2 class='section-title'>Occurrences: <span>${occurrences.length}</span></h2>
				${tables.tableOccurrenceTable(occurrences)}
			</section>
		`;

	}

	// Table Occurrence
	renderTableOccurrence() {
		const resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
		const baseTableUuid = this.node.querySelector('BaseTableReference').getAttribute('UUID');
		const baseTableName = this.node.querySelector('BaseTableReference').getAttribute('name');
		const relationships = xpath(`//AddAction/RelationshipCatalog/Relationship//TableOccurrenceReference[@UUID='${this.uuid}']/ancestor::Relationship`, resultType, this.xmlDocument);

		return html`
			<section class='content-block'>
				<h2 class='section-title'>Info</h2>
				<label>Type: <span>${this.type}</span></label>
				<label>Name: <span>${this.name}</span></label>
				<label>Base Table: <fx-a href=${`/detail?uuid=${baseTableUuid}`}><span>${baseTableName}</span></fx-a></label>
				<label>Relationships: <span>${relationships.length}</span></label>
			</section>
			<section class='content-block'>
			<h2 id='relationships' class='section-title'>Relationships: <span>${relationships.length}</span></h2>
				${tables.relationshipTable(relationships)}
			</section>
		`;
	}

	// Relationship
	renderRelationship() {
		const leftTable = this.node.querySelector('LeftTable')
		const rightTable = this.node.querySelector('RightTable')
		const predicates = this.node.querySelectorAll('JoinPredicateList > JoinPredicate');

		const makeTableDiv = (table, side) => {
			const cascadeCreate = table.getAttribute('cascadeCreate');
			const cascadeDelete = table.getAttribute('cascadeDelete');
			const type = table.getAttribute('type');

			const ref = table.querySelector('TableOccurrenceReference');
			const name = ref.getAttribute('name');
			const uuid = ref.getAttribute('UUID');
			const id = ref.id

			return html`
				<div class='rounded'>
					<h3>${side} Table Occurrence</h3>
					<label>Name: <fx-a href=${`/detail?uuid=${uuid}`}><span>${name}</span></fx-a></label>
					<label>Id: <fx-a href=${`/detail?uuid=${uuid}`}><span>${id}</span></fx-a></label>
					<label>Type: <span>${type}</span></label>
					<label>Create: <span>${cascadeCreate}</span></label>
					<label>Delete: <span>${cascadeDelete}</span></label>
				</div>
			`;
		}

		return html`
			<section class='content-block'>
				<h2 class='section-title'>Info</h2>
				<label>Type: <span>${this.type}</span></label>
				<label>Name: <span>${this.name}</span></label>
				<label>Predicates: <span>${predicates.length}</span></label>
			</section>
			<section class='content-block'>
				<h2 class='section-title'>Tables</h2>
				<div class='flex-row'>
					${makeTableDiv(leftTable, 'Left')}
					${makeTableDiv(rightTable, 'Right')}
				</div>
			</section>
			<section class='content-block'>
				<h2 class='section-title'>Predicates</h2>
				${tables.joinPredicateTable(predicates)}
			</section>
		`;


	}


	// Value List
	renderValueList() {
		const resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
		const type = this.node.querySelector('Source').getAttribute('type');
		const name = this.node.getAttribute('name');

		const options = xpath(`//AddAction//OptionsForValueLists/ValueList[ValueListReference[@UUID='${this.uuid}']]`, resultType, this.xmlDocument);
		console.log(options);
		console.assert(options, `No options found for Value List ${this.uuid}`);
		const primaryField = options[0].querySelector('PrimaryField > FieldReference');
		const secondaryField = options[0].querySelector('SecondaryField > FieldReference');
		const customValues = options[0].querySelector('CustomValues > Text')?.textContent;

		const renderField = (fieldRef) => {
			// field info
			const name = fieldRef.getAttribute('name');
			const uuid = fieldRef.getAttribute('UUID');
			const id = fieldRef.id;

			// table info
			const tableRef = fieldRef.querySelector('TableOccurrenceReference');
			const tableName = tableRef.getAttribute('name');
			const tableUuid = tableRef.getAttribute('UUID');
			const tableId = tableRef.id;

			return html`
				<fx-a href=${`/detail?uuid=${tableUuid}`}>${tableName}</fx-a><span>::</span><fx-a href=${`/detail?uuid=${uuid}`}>${name}</fx-a>
			`;
		}

		return html`
			<section class='content-block'>
				<h2 class='section-title'>Info</h2>
				<label>Type: <span>${type}</span></label>
				<label>Name: <span>${name}</span></label>
				${primaryField ? html`<label>Primary Field: ${renderField(primaryField)}</label>` : ''}
				${secondaryField ? html`<label>Secondary Field: ${renderField(secondaryField)}</label>` : ''}
				${customValues ? html`<label>Custom Values: <div style='white-space: pre; padding-top: .5rem;'>${customValues}</div></label>` : ''}
			</section>
		`;

	}
}


customElements.define('fx-element-detail', FxElementDetail);