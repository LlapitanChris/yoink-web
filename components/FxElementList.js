import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

export default class FxElementList extends LitElement {


	static get styles() {
		return css`


			:host {
				display: block;
				--gap: 10px;

				--grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
				--grid-template-rows: auto;

				--flex-wrap: wrap;
				--flex-direction: row;

				--align-items: stretch;
				--justify-content: flex-start;
			}

			:host(.grid) {
				display: grid;
				grid-template-columns: var(--grid-template-columns);
				grid-template-rows: var(--grid-template-rows);
				justify-content: var(--justify-content);
				align-items: var(--align-items);
				gap: var(--gap);
			}

			:host(.flex) {
				display: flex;
				flex-wrap: var(--flex-wrap);
				flex-direction: var(--flex-direction);
				justify-content: var(--justify-content);
				align-items: var(--align-items);
				gap: var(--gap);
			}

			:host(.list){
				display: grid;
				grid-template-columns: 1fr;
				grid-template-rows: auto;
				gap: var(--gap);

			}

		`;
	}

	render() {

		return html`
			<slot></slot>
		`;
	}
}

customElements.define('fx-element-list', FxElementList);