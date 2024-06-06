import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class CallChainPage extends baseClass {
	static get styles() {
		return css``;
	}

	static get properties() {
		return {
			uuid: { type: String }
		}
	}

	constructor() {
		super();
		// initialize properties here
		this.uuid;

	}

	get xpathString() {
		if (this.uuid) {
			return `//UUID[text()="${this.uuid}"]/..`;
		}
	}

	get node() {
		const node = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
		console.assert(node, `Node with UUID ${this.uuid} not found`);
		return node;
	}

	render() {

		super.setPropsFromUrl();
		const uuid = this.uuid;
		const node = this.node;

		const uuidNode = node.querySelector('UUID');
		const name = node.getAttribute('name');
		const id = node.id;

		// find all times this script is referenced
		const result = super.xpath(`//AddAction//ScriptReference[@UUID='${uuid}']`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		const references = [];
		let ref;
		while( ref = result.iterateNext() ) {
			references.push(ref);
		}

		


		return html`
			<fx-page>
				<h1 slot='title'>${name} Call Chain</h1>
			</fx-page>`
	}

}

customElements.define('call-chain-page', CallChainPage);