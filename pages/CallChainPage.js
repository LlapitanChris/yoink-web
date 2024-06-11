import { LitElement, html, svg, render } from 'https://cdn.skypack.dev/lit-element';

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
			map = new Map(),
			set = new Set(),
			thisLine = [],
			allLines = [],
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

			// convert the xpath result to an array
			const callingElementsArray = xpathToArray(callingElements);
			const calledScriptsArray = xpathToArray(calledScripts);

			// if the map doesn't have the x (column), add it
			if (!map.has(x)) map.set(x, new Map());

			// set y to the number of elements in the map
			// making this a variable because we will increment it
			let y = map.get(x).size;

			// add an array to the map at x
			map.get(x).set(y, []);

			// get the array at the x
			const array = map.get(x).get(y);

			// add the node to the array on the map
			const clone = node.cloneNode(false);
			array.push(clone);




			// if the uuid is not in the set, add it
			// if it IS in the set we don't want to draw the full tree
			// more than once, so we skip it
			if (!set.has(uuid)) {
				set.add(uuid);

				// add this element to the line
				thisLine.push([x, y]);

				// clone the original line so we can start here again
				// if we need to draw in the other direction too
				const lineClone = [...thisLine];

				// for each calling element, add to the map
				if (x <= 0) {

					// if we're at the root add this line to the allLines array
					if (x === 0) allLines.push(thisLine);

					callingElementsArray.forEach((callingElement, index) => {

						// get nearest relevant ancestor
						// this is either a LayoutObject or a Script
						const ancestor =
							callingElement.closest('LayoutObject') ||
							callingElement.closest('Script').querySelector('ScriptReference');

						// ensure we have an ancestor
						console.assert(ancestor, 'No ancestor found for calling element', ancestor);

						// if index is > 0, we're drawing another item in THIS column (x)
						// so we need to reset the y value
						// this is a BRANCH, so we need to create a new line
						// the new line will be a copy of the current line with the new x,y
						let newLine;

						if (index > 0) {
							y = map.get(x).size;
							newLine = [...lineClone.slice(0, -1), [x, y]];
							// add the new line to the allLines array
							allLines.push(newLine);
							console.log('duplicated line', newLine, 'position', allLines.length - 1)
						}


						buildCallMap(
							ancestor, x - 1, map, set,
							newLine || thisLine, allLines
						);

					});
				}

				// now start drawing to the right
				if (x >= 0) {

					// starting from the original node
					if (x === 0) {
						thisLine = [...lineClone]
						allLines.push(thisLine);
					}

					// for each called script, add to the map
					calledScriptsArray.forEach((calledScript, index) => {

						let newLine;

						if (index > 0) {
							y = map.get(x).size;
							newLine = [...lineClone.slice(0, -1), [x, y]];
							allLines.push(newLine);
						}

						buildCallMap(
							calledScript, x + 1, map, set,
							newLine || thisLine, allLines
						);

					});
				}

			}

			return {
				map,
				set,
				thisLine,
				allLines
			}

		}

		// build the call map
		const { map: callMap, set: setOfAll, gridY: gridRowCount, allLines } = buildCallMap(node);
		console.log('callMap', callMap, 'setOfAll', setOfAll, 'gridRowCount', gridRowCount, 'lines', allLines);


		// convert the map to an array sorted by the x value
		const columnsArray = Array.from(callMap).sort((a, b) => a[0] - b[0]);

		// create the columns
		// assign the columns to the correct grid column
		// use the array index to determine the column number
		const columns = columnsArray.map(([x, map], columnIndex) => {
			console.assert(map, 'No map found')
			console.assert(map.size, 'No size found')

			// create an element for each element in the map
			const elements = Array.from(map).map(([y, nodes]) => {
				const node = nodes[0];
				const lines = this.splitTextIntoLines(node.getAttribute('name') || 'LayoutObject', 20);
				const tspans = lines.map((line, i) => svg`<tspan x="100" y="${10 + i * 20}" text-anchor="middle">${line}</tspan>`);

				const groupPosition = [columnIndex * 220, y * 120];
				const groupBoundingBox = {
					x: groupPosition[0],
					y: groupPosition[1],
					width: 200,
					height: 100
				}


				return svg`
					<g id="${x},${y}" transform="translate(${columnIndex * 220}, ${y * 120})">
						<rect x="0" y="0" width="200" height="100" fill="white" stroke="black" stroke-width="1"></rect>
						<text width="200">
							${tspans}
						</text>
					</g>`;
			});

			return html`${elements}`;
		});

		console.log('columns', columns)


		return html`
			<fx-page>
				<h1 slot='title'>${name} Call Chain</h1>
				<div id='call-chain-container'>
					<svg class='call-chain' xmlns="http://www.w3.org/2000/svg">
					${columns}
					</svg>
				</div>
			</fx-page>`
	}

	splitTextIntoLines(text, maxLength) {
		const words = text.split(' ');
		const lines = [];
		let currentLine = words[0];

		for (let i = 1; i < words.length; i++) {
			if (currentLine.length + words[i].length + 1 > maxLength) {
				lines.push(currentLine);
				currentLine = words[i];
			} else {
				currentLine += ' ' + words[i];
			}
		}
		lines.push(currentLine);
		return lines;
	}

}

customElements.define('call-chain-page', CallChainPage);