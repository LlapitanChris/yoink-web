import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";
import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxCalculation.js';

export default class FxNodeDetail extends LitElement {

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
				display: block;
				margin: 0;
				padding: 0;
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

		return html`
			${this[`${this.type}Template`] ?
				this[`${this.type}Template`]() :
				this.defaultTemplate()}
		`;


	}

	defaultTemplate() {
		const name = this.node.getAttribute('name') || this.type;

		return html`
			<div class='header'>
				<span id='type'>${this.type}: </span>
				<span id='name'>${name}</span>
			</div>

			<div class='content'>
				${this.node.cloneNode(true)}
			</div>

			`;
	}
}

customElements.define('fx-node-detail', FxNodeDetail);