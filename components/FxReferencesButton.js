import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import './FxNavButton.js';

export class FxReferencesButton extends LitElement {

	static get properties() {
		return {
			xmlNode: { type: Object },
		}
	}

	static get styles() {
		return css`
			:host {
				display: contents;
			}
		`;
	}

	constructor() {
		super();
		this.xmlNode;
	}



	render() {
		const referenceName = this.xmlNode.nodeName + 'Reference';
		const uuid = this.xmlNode.getAttribute('UUID') || this.xmlNode.querySelector(':scope > UUID')?.textContent;
		if (!uuid) {
			console.error('No UUID found for reference');
			return html`<slot></slot>`;
		}

		return html`
			<fx-nav-button class='very-small nav' href=${`/reference?uuid=${uuid}&type=${referenceName}`}><slot></slot></fx-nav-button>
		`
	}

}

customElements.define('fx-references-button', FxReferencesButton);