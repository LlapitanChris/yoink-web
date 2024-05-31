import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";
import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxCalculation.js';

export default class FxNodePill extends LitElement {

	static get properties() {
		return {
			node: { type: Object }, // xml node
			type: { type: String, reflect: true }, // local name of the node
			uuid: { type: String, reflect: true }, // uuid of the node
		}
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				border: 1px solid #ccc;
				background-color: #f9f9f9;
				border-radius: 5px;
				padding: 5px;
				font-size: 0.8em;
			}
			
			:host([hide-type]) #type {
				display: none;
			}
			`;
	}

	constructor() {
		super();
		this._node;
		this.type = '';
	}
	set node(value) {
		this._node = value;
		this.type = value.nodeName;
		this.uuid = value.querySelector('UUID')?.textContent || value.getAttribute('UUID');
	}

	get node() {
		return this._node;
	}

	render() {
		if (!this.node) {
			return html`<span>no node</span>`;
		} else if (!this.type) {
			return html`<span>no type</span>`;
		}

		this.title = this.type

		if(!this[this.type + 'Template']) {
			return this.defaultTemplate();
		} else {
			return this[this.type + 'Template']();
		}
	}

	defaultTemplate() {
		const name = this.node.getAttribute('name') || this.type;
		return html`
			<span id='type'>${this.type}</span>
			<span id='name'>${name}</span>
			`;
	}

	CalculationTemplate() {
		return html`
			<span id='type'>${this.type}:</span><fx-calculation .xmlNode=${this.node}></fx-calculation></span>
		`;
	}

	FieldReferenceTemplate() {
		const tableOccurrenceName = this.node.querySelector('TableOccurrenceReference').getAttribute('name');
		const fieldName = this.node.getAttribute('name');
		return html`
			<span id='type'>Field:</span>
			<span id='name'>${tableOccurrenceName}::${fieldName}</span>
		`;
	}

	ScriptTemplate() {
		const scriptName = this.node.querySelector('ScriptReference').getAttribute('name');
		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>${scriptName}</span>
		`;
	}

	RelationshipTemplate() {
		const leftTableName = this.node.querySelector('LeftTable > TableOccurrenceReference').getAttribute('name');
		const rightTableName = this.node.querySelector('RightTable > TableOccurrenceReference').getAttribute('name');
		const name = `${leftTableName} > ${rightTableName}`;
		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>${name}</span>
		`;
	}

	LayoutObjectTemplate() {
		const layoutObjectName = this.node.getAttribute('name');
		const layoutObjectType = this.node.getAttribute('type');
		const top = this.node.querySelector('Bounds')?.getAttribute('top');
		const left = this.node.querySelector('Bounds')?.getAttribute('left');
		const scriptName = this.node.querySelector('ScriptReference')?.getAttribute('name');
		const addScriptToTypes = ['Button', 'Grouped Button']


		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>${layoutObjectType}${layoutObjectName ? `: "${layoutObjectName}" ` : ''}
				${`[${top}, ${left}]`}
				${ addScriptToTypes.includes(layoutObjectType) ? ` script: ${scriptName}` : ''}</span>
		`;


	}

	PartTemplate() {
		const partName = this.node.getAttribute('type');
		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>${partName}</span>
		`;
	}

	LayoutTemplate() {
		const layoutName = this.node.getAttribute('name');
		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>${layoutName}</span>
		`;

	}

}

customElements.define('fx-node-pill', FxNodePill);