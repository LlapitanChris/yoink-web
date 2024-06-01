import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export class FxReferencesButton extends LitElement {

	createRenderRoot() {
		return this;
	}

	static get properties() {
		return {
			xmlNode: { type: Object },
			label: { type: String, reflect: true }
		}
	}

	static get styles() {
		return css`
			button {
				border-radius: 5px;
				padding: 0;
				margin: 0;
				cursor: pointer;
				font-size: .8rem;
			}
		`
	
	}

	constructor() {
		super();
		this.xmlNode;
	}



	render() {
		const referenceName = this.xmlNode.nodeName + 'Reference';
		const uuid = this.xmlNode.getAttribute('UUID') || this.xmlNode.querySelector('UUID')?.textContent;
		if (!uuid) {
			console.error('No UUID found for reference');
			return html`<slot></slot>`;
		}

		return html`
			<button @click=${route} href=${`/reference?uuid=${uuid}&type=${referenceName}`}>${this.label}</button>
		`
	}

}

customElements.define('fx-references-button', FxReferencesButton);