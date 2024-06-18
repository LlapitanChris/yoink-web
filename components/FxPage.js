import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

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
				padding: 20px 10px;
				border-bottom: 1px solid black;
			}

			#content {
				flex: 1;
				padding: 10px;
			}

			.sticky {
				position: sticky;
				top: 0;
				z-index: 100;
				background-color: var(--background-color);
			}
			`;
	}

	render() {
		return html`
			<div id='title' class='sticky'><slot name='title'></slot></div>
			<div id='content' class='sticky'>
				<slot></slot>
			</div>
		`;
	}
}
customElements.define('fx-page', FxPage);