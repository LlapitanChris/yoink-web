<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="mynamespace">
	<xsl:output method="html" encoding="utf-8" indent="yes" />

	<!-- 
		Example XML:
			<BaseTableCatalog membercount="41">
				<UUID modifications="52" userName="Kaz McLamore" accountName="Admin"
	timestamp="2023-07-31T18:22:34">EDA578F4-8743-4A42-B8D6-A56261271A2F</UUID>
				<BaseTable id="130" name="Base Table">
					<UUID modifications="2" userName="Kaz McLamore" accountName="Admin"
	timestamp="2022-04-27T17:37:14">0B7B33AA-F7F2-40BA-B5C9-22BE3D1280B1</UUID>
					<TagList></TagList>
				</BaseTable>
				...
			</BaseTableCatalog>
	 -->

	<xsl:template match="/">
		<!-- 
			build HTML table w/ headers 
			- use BaseTableCatalog element membercount attribute as column total
			- apply-templates to BaseTable nodes
			- extract ALL attributes from the UUID element
			- extract the id and name attributes from the BaseTable element

		-->
		<xsl:apply-templates select="//BaseTable" mode="table" />

	</xsl:template>

	<xsl:template match="BaseTable" mode="table">
		<fx-base-table-detail uuid="{UUID}" id="{@id}" name="{@name}" taglist="{TagList}"
			position="{position()}"
			modifications="{UUID/@modifications}" username="{UUID/@userName}"
			accountname="{UUID/@accountName}">
		</fx-base-table-detail>
	</xsl:template>


</xsl:stylesheet>  