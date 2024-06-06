import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import '../components/FxPage.js';
import '../components/FxNodePill.js';

// import the mixin
import { FxDataPageMixin } from '../mixins/FxDataPageMixin.js';

// create the class
const baseClass = FxDataPageMixin(LitElement);

export default class CallChainPage extends baseClass {
	static get styles() {
		return css``;
	}

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

		// find all times this script is referenced
		const calledByNodes = super.xpath(`//AddAction//ScriptReference[@UUID='${uuid}']`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		const callsScriptNodes = super.xpath(`//AddAction/StepsForScripts/Script/ScriptReference[@UUID="${uuid}"]/..//ScriptReference`, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

		// turn into array

		// let ref;
		// while (ref = calledByNodes.iterateNext()) {
		// 	parent = ref.closest('LayoutObject') ||
		// 		ref.closest('Script') ||
		// 		ref.closest('Layout')

		// 	if (parent.querySelector('UUID')?.textContent == uuid ||
		// 		parent.getAttribute('UUID') == uuid ||
		// 		parent.tagName === 'Script' && parent.querySelector(':scope > ScriptReference').getAttribute('UUID') == uuid) {
		// 		continue;
		// 	}
		// 	calledBy.push(parent);
		// }

		// while (ref = callsScriptNodes.iterateNext()) {
		// 	if (ref.querySelector('UUID')?.textContent == uuid ||
		// 		ref.getAttribute('UUID') == uuid
		// 	) {
		// 		continue;
		// 	}
		// 	calls.push(ref);
		// }

		const getElementsArray = (xPathResult, skipUuid, chooseParent = false) => {
			const array = [];
			let node
			while (node = xPathResult.iterateNext()) {
				if (chooseParent) {
					node = node.closest('LayoutObject') || node.closest('Script') || node.closest('Layout');
				}

				if (skipUuid) {
					// determine what the UUID is... 
					const uuidNode = node.querySelector('UUID');
					let uuid;
					if (node.tagName == 'Script') {
						uuid = node.querySelector(':scope > ScriptReference').getAttribute('UUID');
					} else {
						uuid = uuidNode?.textContent || node.getAttribute('UUID');
					}

					if (uuid == this.uuid) {
						continue;
					}

				}

				array.push(node);
			}
			return array;
		}

		const calledBy = getElementsArray(calledByNodes, this.uuid, true);
		const calls = getElementsArray(callsScriptNodes, this.uuid, false);

		const processNodes = (nodes) => {
			console.log('nodes', nodes)

			const ancestors = nodes.map(node => {
				return html`<fx-node-pill .node=${node} ?hide-type=${false}></fx-node-pill>`;
			})

			return html`
				<ul>
					${ancestors.map(ancestor => html`<li>${ancestor}</li>`)}
				</ul>`;

		}


		return html`
			<fx-page>
				<h1 slot='title'>${name} Call Chain</h1>
				<div>
					<h2>Called By:</h2>
					${processNodes(calledBy)}
				</div>
				<div>
					<h2>Calls:</h2>
					${processNodes(calls)}
				</div>
			</fx-page>`
	}

}

customElements.define('call-chain-page', CallChainPage);