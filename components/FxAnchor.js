import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxAnchor extends LitElement {

	static get styles() {
		return css`
			:host {
				display: contents;
			}

			a {
				text-decoration: none;
				color: inherit;
				cursor: pointer;
			}

			a:hover {
				text-decoration: underline;
			}
		`

	}


	render() {
		return html`
			<a><slot @click=${this.retargetEvent}></slot></a>
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
		const newEvent = new CustomEvent('click', {
			bubbles: true, composed: true,
			// copy the details
			detail: event.detail
		});

		// dispatch the event in the shadowRoot
		this.dispatchEvent(newEvent);
	}

}

customElements.define('fx-a', FxAnchor);