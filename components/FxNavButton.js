import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxNavButton extends LitElement {

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
			<button><slot @click=${this.retargetEvent}><slot></button>
		`
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this.handleClick);

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this.handleClick);
	}

	handleClick(event) {
		event.preventDefault();
		event.stopPropagation();
		window.route(event);
	}

	retargetEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		const newEvent = new CustomEvent('click', { bubbles: true, composed: true });
		this.dispatchEvent(newEvent);
	}

}

customElements.define('fx-nav-button', FxNavButton);