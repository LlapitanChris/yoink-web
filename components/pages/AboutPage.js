import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

export default class AboutPage extends LitElement { 
	render() {
		return html`
			<h1>About Page</h1>
			<p>This is the about page</p>
			<a href="/" @click=${route}>Home Page</a>
		`;
	}

}

customElements.define('fx-about-page', AboutPage);