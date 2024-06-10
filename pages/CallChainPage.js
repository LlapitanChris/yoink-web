import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import '../components/FxNodePill.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class CallChainPage extends baseClass {

	static get properties() {
		return {
			uuid: { type: String }
		}
	}

	constructor() {
		super();
		// initialize properties here
		this.uuid;

	}

	get xpathString() {
		if (this.uuid) {
			return `//UUID[text()="${this.uuid}"]/..`;
		}
	}

	get node() {
		const node = super.xpath(this.xpathString, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
		console.assert(node, `Node with UUID ${this.uuid} not found`);
		return node;
	}

	render() {

		super.setPropsFromUrl();
		const uuid = this.uuid;
		const node = this.node;

		const uuidNode = node.querySelector('UUID');
		const name = node.getAttribute('name');
		const id = node.id;


		const buildCallMap = (
			node,
			x = 0,
			y = 0,
			map = new Map(),
			set = new Set(),
		) => {
			// get the uuid from the node
			const uuid = node.getAttribute('UUID') ||
				node.querySelector(':scope > UUID')?.textContent ||
				node.querySelector(':scope > ScriptReference').getAttribute('UUID');
			console.assert(uuid, 'No UUID found on node');

			const xpathToArray = (xPathResult) => {
				const array = [];
				let thisNode;
				while (thisNode = xPathResult.iterateNext()) {
					array.push(thisNode);
				}
				return array;
			}

			const resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;

			// find all the times this script is referenced
			const callingElements = super.xpath(`//AddAction//ScriptReference[@UUID='${uuid}']`, resultType);

			// find all the times this script calls another script
			const calledScripts = super.xpath(`//AddAction/StepsForScripts/Script/ScriptReference[@UUID="${uuid}"]/..//ScriptReference`, resultType);
			const callingElementsArray = xpathToArray(callingElements);
			const calledScriptsArray = xpathToArray(calledScripts);

			// if the map doesn't have the x, add it
			if (!map.has(x)) map.set(x, new Map());

			// add an array to the map at x
			if (!map.get(x).has(uuid)) map.get(x).set(uuid, []);

			// get the array at the x
			const array = map.get(x).get(uuid);

			// add the node to the array on the map
			const clone = node.cloneNode(false);
			array.push(clone);

			// update y
			y = y++;

			// if the uuid is not in the set, add it
			// if it IS in the set we dont' want to draw the full tree
			// more than once, so we skip it
			if (!set.has(uuid)) {
				set.add(uuid);
				// for each calling element, add to the map
				if (x <= 0) {
					for (const callingElement of callingElementsArray) {
						// get nearest relevant ancestor
						// this is either a LayoutObject or a Script
						const ancestor = callingElement.closest('LayoutObject') ||
							callingElement.closest('Script').querySelector('ScriptReference');
						console.assert(ancestor, 'No ancestor found for calling element', ancestor);
						buildCallMap(ancestor, x - 1, y, map, set);
					}
				}

				if (x >= 0) {
					// for each called script, add to the map
					for (const calledScript of calledScriptsArray) {
						buildCallMap(calledScript, x + 1, y, map, set);
					}
				}

			}

			return {
				map,
				set,
			}

		}

		// build the call map
		const { map: callMap, set: setOfAll } = buildCallMap(node);

		// convert the map to an array sorted by map key (level)
		const columnsArray = Array.from(callMap).sort((a, b) => a[0] - b[0]);
		console.log('columnsArray', columnsArray)

		// create the columns
		// assign the columns to the correct grid column
		// use the array index to determine the column number
		const columns = columnsArray.map(([level, map], colIndex) => {
			console.assert(map, 'No map found')
			console.assert(map.size, 'No size found')

			// create an element for each element in the map
			const elements = Array.from(map).map(([uuid, nodes]) => {
				const node = nodes[0];
				return html`
					<fx-node-pill
					.node=${node}
					>
					</fx-node-pill>
				`;
			});

			return html`
				<div class='column' style='grid-column: ${colIndex + 1}' id="${level}">
					${elements}
				</div>
			`;
		});

		console.log('columns', columns)





		return html`
			<fx-page>
				<h1 slot='title'>${name} Call Chain</h1>
				<div class='call-chain'>
					${columns}
				</div>
			</fx-page>`
	}

}

customElements.define('call-chain-page', CallChainPage);