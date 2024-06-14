import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxNameValuePair extends LitElement {
	static get properties() {
		return {
			name: { type: String },
			value: { type: String }
		}
	}

	static get styles() {
		return css`
			:host {
				
				--border: 1px solid black;
				--label-width: min-content;
				--flex-direction: row;
				--flex-gap: .25rem;

				--value-flex-direction: row;
				--value-flex-gap: .25rem;
				--value-white-space: nowrap;

				--label-white-space: nowrap;
				--separator: none;

				--padding-left: .25rem;
				--padding-right: .25rem;
				--padding-top: .25rem;
				--padding-bottom: .25rem;

				--label-font-weight: 500;
				--value-font-weight: 350;

				display: flex;
			}

			#container {
				display: flex;
				flex-direction: var(--flex-direction);
				gap: var(--flex-gap);
				overflow: hidden;
				align-items: flex-start;
				padding-left: var(--padding-left);
				padding-right: var(--padding-right);
				align-items: stretch;

			}

			#name {
				display: flex;
				align-items: flex-start;
				font-weight: var(--label-font-weight);
				width: var(--label-width);
				white-space: var(--label-white-space);
				border-right: var(--separator);
				padding-right: var(--padding-right);
				padding-top: var(--padding-top);
				padding-bottom: var(--padding-bottom);
			}

			#value {
				display: flex;
				font-weight: var(--value-font-weight);
				flex-direction: var(--value-flex-direction);
				gap: var(--value-flex-gap);
				white-space: var(--value-white-space);
				flex-wrap: wrap;

				align-items: center;
			}

			`;
	}

	render() {
		return html`
			<div id="container">
				<div id="name">${this.name}</div>
				<div id="value"><slot></slot></div>
			</div>
		`;
	}

}

customElements.define('fx-name-value-pair', FxNameValuePair);