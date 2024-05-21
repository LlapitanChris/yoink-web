import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import './FxElementList.js';

export default class FxPage extends LitElement { 
	
	static get properties() {
		return {
			display: { type: String, reflect: true},
		}
	};

	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 10px;
				padding: 10px;
				position: relative;

				--title-size: 3rem;
				--title-weight: 500;
				--background-color: white;

				background-color: var(--background-color);
				height: 100%;
			}

			#title {
				font-size: var(--title-size);
				font-weight: var(--title-weight);
				display: flex;
				justify-content: stretch;
				align-items: center;
				height: 2rem;
				background-color: white;
				position: sticky;
				top: 0;
				background-color:	var(--background-color);
				z-index: 100;
				padding: 20px 10px;
				border-bottom: 1px solid black;
			}

			fx-element-list {
				padding-top: 1rem;
			}
			`;
	}

	render() {
		return html`
			<div id='title'><slot name='title'></slot></div>
				<slot></slot>
		`;
	}
}
customElements.define('fx-page', FxPage);