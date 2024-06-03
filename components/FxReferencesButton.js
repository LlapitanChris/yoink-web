import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export class FxReferencesButton extends LitElement {

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
			}
			:host{
				display: contents
			}

			:host(.small) button {
				font-size: 0.8em;
				padding: 2px 5px;
			}

			:host(.very-small) button {
				font-size: 0.7em;
				padding: 1px 3px;
				border-radius: 3px;
				border-width: 1px;
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