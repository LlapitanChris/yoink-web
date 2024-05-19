import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';
import './FxNameValuePair.js'
import './FxModificationTag.js'

/* <Field id="15" name="UUID userName" fieldtype="Normal" datatype="Text" comment="">
	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-06-04T13:56:49">A185470B-51F3-4036-9A4F-A4607B1B18DD</UUID>
	<AutoEnter type="" prohibitModification="False"></AutoEnter>
	<Validation type="OnlyDuringDataEntry" allowOverride="True" notEmpty="False" unique="False" existing="False"></Validation>
	<Storage autoIndex="True" index="None" global="False" maxRepetitions="1">
		<LanguageReference name="English" id="21"></LanguageReference>
	</Storage>
	<TagList></TagList>
</Field> */


export default class FxField extends LitElement {

	constructor() {
		super();
		this.showDetail = false;
		this._xml = null;
		this.id = '';
		this.name = '';
		this.uuid = '';
		this.lastModified = { modifications: '', username: '', accountname: '', timestamp: ''};
		this.autoenter = { prohibitModification: '', type: '' };

	}

	static get properties() {
		return {
			showDetail: { type: Boolean, reflect: true, attibute: 'show-detail' },
			xml: { type: Object },
			uuidXml: { type: Object, state: true },
			id: { type: String, reflect: true },
			uuid: { type: String, reflect: true },
			name: { type: String, state: true },
			autoenter: { type: Object, state: true },

		}
	}

	static get styles() {

		return css`
			:host {
				display: block;
				padding: 10px;
				margin: 10px;
				border: 1px solid black;
				position: relative;
				--title-size: 1.5em;
			}
			#container {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
			}
			#container div {
				margin-right: 10px;
				border: 1px solid black;
			}
			h2{
				font-size: var(--title-size);
			}
			`;

	}

	set xml(value) {
		this._xml = value;
		this.id = value.getAttribute('id');
		this.name = value.getAttribute('name');
		this.uuid = value.querySelector('UUID')?.textContent;
		this.uuidXml = value.querySelector('UUID');
		this.autoenter.prohibitModification = value.querySelector('AutoEnter')?.getAttribute('prohibitModification');
		this.autoenter.type = value.querySelector('AutoEnter')?.getAttribute('type');

	}

	get xml() {
		return this._xml;

	}

	render() {
		return html`
		<h2>${this.name}</h2>
		<div id='container'>
			<div id='id'>ID: ${this.id}</div>
			<div id='autoenter'>AutoEnter: ${this.autoenter.type} Prohibit Modification: ${this.autoenter.prohibitModification}</div>
			<fx-modification-tag .xml=${this.uuidXml}></fx-modification-tag>
		</div>
		`;

	}
}

customElements.define('fx-field', FxField);