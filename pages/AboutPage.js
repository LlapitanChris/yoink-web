import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';

export default class AboutPage extends LitElement { 

	createRenderRoot () {
		return this;
	}

	render() {
		return html`
			<fx-page>
				<h1 slot='title'>About Page</h1>
				<p>This is the about page</p>
				<a href="/" @click=${route}>Home Page</a>
			</fx-page>
		`;
	}

}

customElements.define('fx-about-page', AboutPage);