import { LitElement, html } from "https://cdn.skypack.dev/lit-element";
import '../components/FxNameValuePair.js';
import '../components/FxDatabaseElement.js';
import { FxDatabaseElementMixin } from "../mixins/FxDatabaseElementMixin.js";

let baseClass = LitElement;
baseClass = FxDatabaseElementMixin(baseClass);

// this is the template for the table occurrence
{/* <TableOccurrence viewState="Collapse" height="60" id="1065090" name="Base Table" type="Local">
	<UUID modifications="35" userName="Kaz McLamore" accountName="Admin" timestamp="2023-06-30T10:01:20">0BF51AA5-C47E-473F-A385-2C1685BCD380</UUID>
	<BaseTableSourceReference type="BaseTableReference">
		<BaseTableReference id="130" name="Base Table" UUID="0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1"></BaseTableReference>
	</BaseTableSourceReference>
	<CoordRect top="769" left="1195" bottom="887" right="1326"></CoordRect>
	<Color red="102" green="177" blue="50" alpha="1.00"></Color>
	<TagList></TagList>
</TableOccurrence> */}

export default class FxTableOccurrence extends baseClass { 

	// no shadow dom
	createRenderRoot() { 
		return this;
	}

	constructor() {
		super();
		
	}

	set xmlNode(value) {
		super.xmlNode = value;
		this.viewState = value.getAttribute('viewState');
		this.height = value.getAttribute('height');
		this.taglist = value.querySelector('TagList').textContent;
		this.type = value.getAttribute('type');
		this.color = {
			red: value.querySelector('Color').getAttribute('red'),
			green: value.querySelector('Color').getAttribute('green'),
			blue: value.querySelector('Color').getAttribute('blue'),
			alpha: value.querySelector('Color').getAttribute('alpha'),
		}
		this.coordRect = {
			top: value.querySelector('CoordRect').getAttribute('top'),
			left: value.querySelector('CoordRect').getAttribute('left'),
			bottom: value.querySelector('CoordRect').getAttribute('bottom'),
			right: value.querySelector('CoordRect').getAttribute('right'),
		}


	}

	render() {
		return html`
		<fx-database-element class='bordered' .id=${this.id}>
			<h2 slot='title'>${this.name}</h2>
			<fx-name-value-pair .name=${`View State`}>${this.viewState}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Height`}>${this.height}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Type`}>${this.type}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Tag List`}>${this.taglist}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Color`}>${this.color.red},${this.color.green},${this.color.blue},${this.color.alpha}</fx-name-value-pair>
			<fx-name-value-pair .name=${`Coord Rect`}>${this.coordRect.top},${this.coordRect.left},${this.coordRect.bottom},${this.coordRect.right}</fx-name-value-pair>
			${this.renderModificationTag()}
		</fx-database-element>`
		
	}
	

}

customElements.define('fx-table-occurrence', FxTableOccurrence);