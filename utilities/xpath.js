export function xpath(query, resultType, xmlDocument) {
	if (!xmlDocument) {
		console.error(`no xml document to evaluate xpath query ${query}`);
		return;
	}

	const result = xmlDocument.evaluate(query, xmlDocument, null, resultType, null);
	// if it's an iterator type, convert to array
	if (resultType === XPathResult.ORDERED_NODE_ITERATOR_TYPE || resultType === XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
		return xpathResultToArray(result);
	} else {
		return result;
	}
	
}

export function xpathResultToArray(result) {
	const nodes = [];
	let node = result.iterateNext();
	while (node) {
		nodes.push(node);
		node = result.iterateNext();
	}
	return nodes;
}