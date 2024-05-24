import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxPadding extends LitElement {

	createRenderRoot() {
		return this;
	}
	static get properties() {
		return {
			level: { type: Number, reflect: true },
		}

	}


	constructor() {
		super();
		this.level = 0;
	}

	render() {
		// build a div for each level of padding
		let paddingTemplatesArray = [];
		for (let i = 0; i < this.level; ++i) {
			paddingTemplatesArray.push(html`<div></div>`);
		}
		return html`
			<div id='container'>
				${paddingTemplatesArray}
			</div>
		`;
	}

}
customElements.define('fx-padding', FxPadding);