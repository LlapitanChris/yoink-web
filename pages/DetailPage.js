import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import '../components/FxNodeDetail.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class DetailPage extends baseClass {
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

		return html`
			<fx-page>
				<h1 slot='title'>Detail</h1>
				<fx-node-detail .node=${this.node}></fx-node-detail>
			</fx-page>`
	}

}

customElements.define('detail-page', DetailPage);