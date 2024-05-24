import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';

export default class FxCalculation extends LitElement { 
	static get properties() {
		return {
			calculation: { type: String },
			isOpen: { type: Boolean, reflect: true, attribute: 'is-open' },
			xmlNode: { type: Object },
		}
	}
	createRenderRoot() {
		return this;
	}

	set xmlNode(value) {
		this._xmlNode = value;


	}

	get xmlNode() {
		return this._xmlNode;
	}

	constructor() {
		super();
		this.calculation = '';
		this.isOpen = false;
	}

	render() {

		if (!this.xmlNode) {
			return html`<div id='container'>${this.calculation}</div>`
		}
		// keep track of references we've already seen
		// to avoid creating duplicates
		const seen = new Set();

		// get the xml chunks
		const chunks = this.xmlNode.querySelectorAll('Chunk');
		// get the calc text
		const calcText = this.xmlNode.querySelector('Text').textContent;
		const templates = [];
		chunks.forEach(chunk => {
			// get the chunk type
			const type = chunk.getAttribute('type');
			switch (type) {
				case 'FieldRef':
					const tableName = chunk.querySelector('TableOccurrenceReference').getAttribute('name')
					const tableOccurrenceId = chunk.querySelector('TableOccurrenceReference').getAttribute('id')
					const fieldName = chunk.querySelector('FieldReference').getAttribute('name');
					const fieldId = chunk.querySelector('FieldReference').getAttribute('id');
					const fieldUuid = chunk.querySelector('FieldReference').getAttribute('UUID');
					const repetition = chunk.querySelector('FieldReference').getAttribute('repetition');
					// if we've already seen this reference, skip it
					if (seen.has(`${fieldUuid}`)) {
						break;
					}


					this.classList.add(`field-${fieldUuid}`);
					this.classList.add(`table-${tableOccurrenceId}`)
					templates.push(html`
						<span>
						[<a href='/table-occurrence?id=${tableOccurrenceId}' @click=${route}>${tableName}</a>::<a href="/field?uuid=${fieldUuid}" @click=${route}>${fieldName}]</a></span>
					`)

					seen.add(`${fieldUuid}`);
					break;

				case 'FunctionRef':
				case 'CustomFunctionRef':

					// if we've already seen this reference, skip it
					if (seen.has(chunk.textContent)) {
						break;
					}

					this.classList.add(`function-${chunk.textContent}`);

					templates.push(html`
						<span class="${type == 'CustomFunctionRef' ? 'custom-' : nothing}function link" href="/function?name=${chunk.textContent}" @click=${route}>${chunk.textContent}</span>
					`);
					seen.add(chunk.textContent);
					break;

				case 'VariableReference':
					const variableName = chunk.textContent;
					this.setAttribute('variable', variableName);
					// if we've already seen this reference, skip it
					if (seen.has(`variable-${variableName}`)) {
						break;
					}

					this.classList.add(`variable-${variableName}`);
					templates.push(html`
						<span class='variable'>${variableName}</span>
					`);
					seen.add(`variable-${variableName}`);
					break;

				default:
					//  do nothing
					break
			}


		});

		return html`
			<div id='container'>
				<div id='calculation'>${calcText}</div>
				<div id='references'>${templates}</div>
			</div>
		`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this.toggleOpen);
	
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this.toggleOpen);
	}

	toggleOpen() {
		this.isOpen = !this.isOpen;
	}


}

customElements.define('fx-calculation', FxCalculation);