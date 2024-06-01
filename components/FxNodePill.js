import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";
import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxCalculation.js';

export default class FxNodePill extends LitElement {

	static get properties() {
		return {
			node: { type: Object }, // xml node
			type: { type: String }, // local name of the node
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
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			:host([hide-type]) #type {
				display: none;
			}

			:host(.script-pill), 
			:host(.scriptreference-pill) {
				background-color: rgb(188, 197, 240);
				border: 1px solid hsl(230, 68.20%, 69.20%);
			}

			:host(.layout-pill){
				background-color: rgb(164, 223, 153);
				border: 1px solid hsl(120, 65.80%, 36.70%);
			}
			:host(.layoutobject-pill){
				background-color: hsl(44, 65.80%, 69.00%);
				border: 1px solid hsl(44, 75.40%, 40%);
			}
			:host(.relationship-pill){
				background-color: rgb(222, 169, 252);
				border: 1px solid hsl( 280, 68.20%, 69.20%);
			}
			:host(.fieldreference-pill),
			:host(.field-pill){
				background-color: rgb(255, 182, 182);
				border: 1px solid hsl( 0, 68.20%, 69.20%);
			}
			:host(.privilegeset-pill){
				background-color: rgb(187, 187, 187);
				border: 1px solid hsl( 0, 0%, 50%);
			}
			:host(.tableoccurrence-pill),
			:host(.tableoccurrencereference-pill){
				background-color: rgb(255, 168, 242);
				border: 1px solid hsl( 320, 68.20%, 69.20%);
			}
			:host(.basetablereference-pill){
				background-color: rgb(255, 201, 168);
				border: 1px solid hsl( 20, 68.20%, 69.20%);
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
		this.classList.add(`${this.type.toLowerCase()}-pill`);

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
		const tableOccurrenceName = this.node.querySelector('TableOccurrenceReference')?.getAttribute('name');
		const fieldName = this.node.getAttribute('name');
		return html`
			<span id='type'>Field:</span>
			<span id='name'>${tableOccurrenceName ? `${tableOccurrenceName}::` : nothing}${fieldName}</span>
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

	StepTemplate() {
		const stepName = this.node.getAttribute('name');
		const index = this.node.getAttribute('index');

		if (stepName == 'Perform Script') {
			const scriptName = this.node.querySelector('ScriptReference').getAttribute('name') ||
				this.node.querySelector('Parameter List[name="By name"] Calculation Text').textContent;
			return html`
				<span id='type'>${this.type}:</span>
				<span id='name'>#${index}: ${stepName} "${scriptName}"</span>
			`;
		}

		return html`
			<span id='type'>${this.type}:</span>
			<span id='name'>#${index}: ${stepName}</span>
		`;
	
	}
}

customElements.define('fx-node-pill', FxNodePill);