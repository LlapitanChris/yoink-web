export async function XmlToHtml(pathToXml, pathToXslt) {
	try {
		let xml = await fetch(pathToXml).then(response => response.text())
		const xslt = await fetch(pathToXslt).then(response => response.text())


		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(xml, 'text/xml')
		const xsltDoc = parser.parseFromString(xslt, 'text/xml')
		const xsltProcessor = new XSLTProcessor()
		xsltProcessor.importStylesheet(xsltDoc)
		const fragment = xsltProcessor.transformToFragment(xmlDoc, document)
		console.debug('xmlDoc:', xmlDoc)
		console.debug('xsltDoc:', xsltDoc)
		console.debug('Fragment:', fragment)
		return fragment
		
	} catch (error) {
		console.error('Error occurred in XmlToHtml:', error)
		return null
	}
}