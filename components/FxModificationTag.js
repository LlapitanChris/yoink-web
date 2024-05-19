import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';
import './FxNameValuePair.js';

export default class FxModificationTag extends LitElement { 
	static get properties() {
		return {
			xml: { type: Object },
			modCount: { type: Number },
			username: { type: String },
			accountname: { type: String },
			timestamp: { type: String },
			data: { type: Object },
		}
	}

	set xml(value) { 
		if (!value) return;
		try {
			this._xml = value;
			this.modCount = value.getAttribute('modifications');
			this.username = value.getAttribute('userName');
			this.accountname = value.getAttribute('accountName');
			this.timestamp = value.getAttribute('timestamp');
			this.timestampConverted = new Date(this.timestamp).toLocaleString();
		} catch (error) {
			console.error('error setting xml', error);
			console.debug('xml', value)
		}
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.group {
				background-color: lightgray;
				border: 1px solid black;
				padding-left: .25rem;
				border-radius: 5px;
				--value-flex-gap: .25rem;
				--padding-left: 0;
				--padding-right: .25rem;
				--separator: 1px solid black;
			}
			fx-name-value-pair:not(.group) {
				font-size: .75rem;
				--padding-left: 0;
				--padding-right: 0;
				--value-white-space: wrap;
			}
			`;
		
	}

	render() {
		return html`
		<fx-name-value-pair .name=${`last modification`} class='group'>
			<fx-name-value-pair .name=${`mod count`}>${this.modCount}</fx-name-value-pair>
			<fx-name-value-pair .name=${`user`}>${this.username}</fx-name-value-pair>
			<fx-name-value-pair .name=${`account`}>${this.accountname}</fx-name-value-pair>
			<fx-name-value-pair .name=${`timestamp`}>${this.timestampConverted}</fx-name-value-pair>
		</fx-name-value-pair>
		`
	}
}

customElements.define('fx-modification-tag', FxModificationTag);