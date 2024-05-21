import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';

export default class HomePage extends LitElement { 
	createRenderRoot () {
		return this;
	}

	render() {
		return html`
		<fx-page>
			<h1 slot='title'>Home Page</h1>
			<p>This is the home page</p>
			<a href="/about" @click=${route}>About</a>
			<a href="/tables" @click=${route}>Tables</a>
			<a href="/fields" @click=${route}>Fields</a>
		</fx-page>
		`;
	}


}

customElements.define('fx-home-page', HomePage);