import { LitElement, html, css, nothing } from 'https://cdn.skypack.dev/lit-element';
import './FxNameValuePair.js'
import './FxModificationTag.js'
import FxDatabaseElement from './FxDatabaseElement.js';

/* <Field id="15" name="UUID userName" fieldtype="Normal" datatype="Text" comment="">
	<UUID modifications="2" userName="Kaz McLamore" accountName="Admin" timestamp="2022-06-04T13:56:49">A185470B-51F3-4036-9A4F-A4607B1B18DD</UUID>
	<AutoEnter type="" prohibitModification="False"></AutoEnter>
	<Validation type="OnlyDuringDataEntry" allowOverride="True" notEmpty="False" unique="False" existing="False"></Validation>
	<Storage autoIndex="True" index="None" global="False" maxRepetitions="1">
		<LanguageReference name="English" id="21"></LanguageReference>
	</Storage>
	<TagList></TagList>
</Field> */


export default class FxField extends FxDatabaseElement {

	constructor() {
		super();
		this._xmlNode;
		this._xmlDocument
		this.name = '';
		this.autoenter = { prohibitModification: '', type: '' };

	}

	static get properties() {
		return {
			name: { type: String, state: true },
			autoenter: { type: Object, state: true },
			xmlNode: { type: Object },

		}
	}

	static get styles() {

		return [
			super.styles,
			css`
			`
		];
	}

	set xmlNode(value) {
		super.xml = value;
		this._xmlNode = value;
		this.name = value.getAttribute('name');
		this.fieldType = value.getAttribute('fieldtype');
		this.dataType = value.getAttribute('datatype');
		this.autoenter.prohibitModification = value.querySelector('AutoEnter')?.getAttribute('prohibitModification');
		this.autoenter.type = value.querySelector('AutoEnter')?.getAttribute('type');
		this.isAutoEnter = this.autoenter.type ? true : false;

	}

	get xmlNode() {
		return this._xmlNode;
	}

	lightDomTemplate() {
		return html`
		<h2 slot='title'>${this.name}</h2>
			<fx-name-value-pair .name=${`Field Type`}>${this.fieldType}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Data Type`}>${this.dataType}</fx-name-value-pair>
			${
			this.isAutoEnter ? html`
				<fx-name-value-pair .name=${`AutoEnter`}>
					<fx-name-value-pair .name=${`Type`}>${this.autoenter.type}</fx-name-value-pair>
					<fx-name-value-pair .name=${`Prohibit Modification`}>${this.autoenter.prohibitModification}</fx-name-value-pair>
				</fx-name-value-pair>
				` : nothing
			}
		`;

	}
}

customElements.define('fx-field', FxField);