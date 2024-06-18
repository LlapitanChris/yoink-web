import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

const baseClass = FxDataPageMixin(LitElement);

export default class HomePage extends baseClass { 

	render() {
		return html`
		<fx-page>
			<h1 slot='title'>Home Page</h1>
			<p>This is the home page</p>
			<a href="/catalog" @click=${route}>Catalogs</a>
			<a href="/about" @click=${route}>About</a>


		</fx-page>
		`;
	}

}

customElements.define('fx-home-page', HomePage);