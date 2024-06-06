

import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxButton extends LitElement {
	static get styles() {
		return css`
			:host {
				display: contents
			}

			button {
				border-radius: 5px;
				padding: 0;
				margin: 0;
				cursor: pointer;
				border: 1px solid #ccc;
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

	render() {
		return html`
			<button><slot><slot></button>
		`
	}

}

customElements.define('fx-button', FxButton);