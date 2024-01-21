use [Acontplus]
go 

DECLARE @comprobatante AS TABLE (
		 idDocumento INT NOT NULL
		,xmlComp xml NOT NULL
		,versionComp VARCHAR(5) NOT NULL
	)

INSERT INTO @comprobatante (idDocumento,versionComp,xmlComp)
SELECT dr.idDocumento
	  ,dr.versionComp 
	  ,xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), CONVERT(XML, DECOMPRESS(dr.xmlCompressed)).query('//autorizacion/comprobante'))))
FROM Recepcion.DocumentoRecibido dr
WHERE codDoc IN('01','04') AND xmlCompressed IS NOT NULL
	

	--INSERT INTO [Recepcion].[DocumentoImpuesto]
 --          ([DocumentoRecibidoId]
 --          ,[Discount]
 --          ,[Code]
 --          ,[CodePercentage]
 --          ,[Fee]
 --          ,[TaxBase]
 --          ,[TaxValue]
 --          )
	SELECT 
		 cp.idDocumento
		,descuento = x.y.value('(descuento)[1]','NUMERIC(18,5)')
		,codigo = x.y.value('(impuestos/impuesto/codigo)[1]','VARCHAR(5)')
		,codigoPorcentaje = x.y.value('(impuestos/impuesto/codigoPorcentaje)[1]','VARCHAR(5)')
		,tarifa = x.y.value('(impuestos/impuesto/tarifa)[1]','NUMERIC(18,5)')
		,baseImponible = x.y.value('(impuestos/impuesto/baseImponible)[1]','NUMERIC(18,5)')
		,valor = x.y.value('(impuestos/impuesto/valor)[1]','NUMERIC(18,5)')
	FROM @comprobatante cp
	CROSS APPLY cp.xmlComp.nodes('//detalles/detalle') x(y)
	ORDER BY cp.idDocumento