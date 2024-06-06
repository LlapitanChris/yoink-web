import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';
import '../components/FxButton.js';

export default class FxNavButton extends LitElement {



	render() {
		return html`
			<fx-button class='very-small' ><slot></slot></fx-button>
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
		if (this.hasAttribute('href')) {
			window.route(event);
		}

	}

}

customElements.define('fx-nav-button', FxNavButton);