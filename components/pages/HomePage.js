import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

export default class HomePage extends LitElement { 
	render() {
		return html`
			<h1>Home Page</h1>
			<p>This is the home page</p>
			<a href="/about" @click=${route}>About</a>
			<a href="/tables" @click=${route}>Tables</a>
		`;
	}


}

customElements.define('fx-home-page', HomePage);