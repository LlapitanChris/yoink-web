import { LitElement, html, css, render } from 'https://cdn.skypack.dev/lit-element';

import './FxModificationTag.js';

export default class FxDatabaseElement extends LitElement { 

	constructor() {
		super();
		this.id;

	}

	static get properties() {
		return {
			id: { type: String, },
		};

	}

	static get styles() { 
		return css`

			:host {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 10px;
				--content-flex-direction: row;
				--content-flex-wrap: wrap;
				--content-flex-gap: 10px;
				padding: 10px;
				overflow: hidden;
			}


			#title {
				border-bottom: 1px solid black;
				padding-bottom: 5px;
				font-size: var(--title-size, 1.5rem);
			}

			#main-content {
				display: flex;
				align-items: flex-start;
				flex-direction: var(--content-flex-direction);
				flex-wrap: var(--content-flex-wrap);
				gap: var(--content-flex-gap);
				width: 100%;
				height: 100%;

			}

			#id {
				position: absolute;
				top: 10px;
				right: 10px;
			}

			::slotted(fx-name-value-pair) {
				border: 1px solid black;
				border-radius: 5px;
				--separator: 1px solid black;
			}

		
		`;
	}


	render() {
		return html`
		<div id='title'><slot name='title'></slot></div>
		<div id='id'>${this.id}</div>
			<div id="main-content">
				<slot></slot>
			</div>
			<div id='modification-info'>
				<slot name='modification-info'></slot>
			</div>
		`;
	}


}

customElements.define('fx-database-element', FxDatabaseElement);