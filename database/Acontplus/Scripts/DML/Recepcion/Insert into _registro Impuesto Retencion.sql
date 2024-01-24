USE [Acontplus]
GO
	DECLARE @comprobantes AS TABLE(
		 idDocumento INT NOT NULL
		,versionComp VARCHAR(5) NOT NULL
		,xmlComp XML 
	)

	DECLARE @retencion AS TABLE (
 		 idDocumento INT NOT NULL
		,descuento NUMERIC(18,5) NOT NULL
		,codigo VARCHAR(5) NOT NULL
		,codigoRetencion VARCHAR(5) NOT NULL
		,baseImponible NUMERIC(18,2) NOT NULL
		,tarifa NUMERIC(18,2) NOT NULL
		,valor NUMERIC(18,2) NOT NULL
	)

	INSERT INTO @comprobantes(idDocumento,versionComp,xmlComp)
	SELECT 
		 idDocumento
		,versionComp
		,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX),CONVERT(XML, DECOMPRESS(dr.xmlCompressed)).query('//autorizacion/comprobante')))
	FROM Recepcion.DocumentoRecibido dr WHERE dr.codDoc = '07' AND dr.xmlCompressed IS NOT NULL

	INSERT INTO @retencion SELECT 
		cm.idDocumento
	   ,0
	   ,codigo            = x.y.value('(codigo)[1]','VARCHAR(5)')
	   ,codigoRetencion   = x.y.value('(codigoRetencion)[1]','VARCHAR(50)')
	   ,baseImponible     = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
	   ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
	   ,valorRetenido     = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//docSustento/retenciones/retencion') x(y)
	WHERE cm.versionComp = '2.0.0'

	INSERT INTO @retencion SELECT 
		cm.idDocumento
	   ,0
	   ,codigo            = x.y.value('(codigo)[1]','VARCHAR(5)')
	   ,codigoRetencion   = x.y.value('(codigoRetencion)[1]','VARCHAR(50)')
	   ,baseImponible     = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
	   ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
	   ,valorRetenido     = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//impuestos/impuesto') x(y)
	WHERE cm.versionComp = '1.0.0'
     
	 --INSERT INTO [Recepcion].[DocumentoImpuesto]
  --         ([DocumentoRecibidoId]
  --         ,[Discount]
  --         ,[Code]
  --         ,[CodePercentage]
  --         ,[Fee]
  --         ,[TaxBase]
  --         ,[TaxValue]
  --         )
	 --select idDocumento 
		--   ,descuento 
		--   ,codigo 
		--   ,codigoRetencion 
		--   ,tarifa 
  --         ,baseImponible 
		--   ,valor
	 --from @retencion



