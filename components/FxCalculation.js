import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxCalculation extends LitElement { 
	static get properties() {
		return {
			calculation: { type: String },
			isOpen: { type: Boolean, reflect: true, attribute: 'is-open'}
		}
	}
	static get styles() {
		return css`
			:host {
				display: contents;
				cursor: pointer;
			}
			#container:hover{
				color: blue;
			}

			#container {
				display: inline;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			#container:before {
				content: '[';
				display: inline;
			}
			#container:after {
				content: ']';
				display: inline;
			}
			:host([is-open]) #container {
				margin: 10px 0;
				display: flex;
				flex-direction: column;
				height: min-content;
				overflow: auto;
				background: rgb(248, 243, 243);
				white-space: pre-line;
				padding: 10px;
				border: 1px solid black;
				border-radius: 5px;
			}
			:host([is-open]) #container:hover {
				color: inherit;
			}

			:host([is-open]) #container:before {
				content: '[';
				display: none;
			}
			:host([is-open]) #container:after {
				content: ']';
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.calculation = '';
		this.isOpen = false;
	}

	render() {
		return html`
			<div id='container'>
				${this.calculation}
			</div>
		`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this.toggleOpen);
	
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this.toggleOpen);
	}

	toggleOpen() {
		this.isOpen = !this.isOpen;
	}


}

customElements.define('fx-calculation', FxCalculation);