import { LitElement, html } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import '../components/FxDataTable.js';
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

const baseClass = FxDataPageMixin(LitElement);

export default class HomePage extends baseClass { 
	createRenderRoot () {
		return this;
	}

	render() {
		return html`
		<fx-page>
			<h1 slot='title'>Home Page</h1>
			<p>This is the home page</p>
			<a href="/catalog" @click=${route}>Catalogs</a>
			<a href="/base-table" @click=${route}>Tables</a>
			<a href="/table-occurrence" @click=${route}>Table Occurrences</a>
			<a href="/script" @click=${route}>Script</a>
			<a href="/script-step" @click=${route}>Script Steps</a>
			<a href="/layout" @click=${route}>Layouts</a>

			<a href="/field" @click=${route}>Fields</a>
			<a href="/file-access" @click=${route}>File Accesses</a>
			<a href="/about" @click=${route}>About</a>


		</fx-page>
		`;
	}


}

customElements.define('fx-home-page', HomePage);