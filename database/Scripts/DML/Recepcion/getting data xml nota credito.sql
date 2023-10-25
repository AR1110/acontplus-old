use [AcontPlus]
go 


DECLARE @tmp as Table(
idDocumento INT,
versionComp VARCHAR(10) NOT NULL,
xmlComp xml
)

DECLARE @devoluciones AS TABLE(
	idDocumentoRecibido INT,
	codDocSustento VARCHAR(5),
	numDocSustento VARCHAR(50),
	fechaEmisionDocSustento VARCHAR(100),
	codigo VARCHAR(5),
	baseImponible NUMERIC(15,5),
	porcentajeRetener NUMERIC(15,5),
	valorRetenido NUMERIC(15,5)
)

INSERT INTO @tmp(idDocumento,versionComp,xmlComp)
SELECT 
 ci.idDocumento
,versionComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).value('(comprobante/notaCredito/@version)[1]', 'VARCHAR(10)')
,xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
FROM Recepcion.DocumentoRecibido ci
where downloaded = 'DE' AND codDoc = '04' AND complete = 0




INSERT INTO @devoluciones(idDocumentoRecibido,codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
SELECT 
     idDocumento
    ,codDocSustento = x.y.value('(codDocModificado)[1]','VARCHAR(5)')
    ,numDocSustento = x.y.value('(numDocModificado)[1]','VARCHAR(25)')
    ,fechaEmisionDocSustento = x.y.value('(fechaEmisionDocSustento)[1]','VARCHAR(25)')
	,codigo = x.y.value('(//totalConImpuestos/totalImpuesto/codigo)[1]','VARCHAR(5)')
	,baseImponible = x.y.value('(//totalConImpuestos/totalImpuesto/baseImponible)[1]','NUMERIC(18,2)')
	,porcentajeRetener = x.y.value('(//totalConImpuestos/totalImpuesto/tarifa)[1]','NUMERIC(18,2)')
	,valorRetenido = x.y.value('(//totalConImpuestos/totalImpuesto/valor)[1]','NUMERIC(18,2)')
FROM @tmp r
CROSS APPLY r.xmlComp.nodes('//comprobante/notaCredito/infoNotaCredito') x(y) 

SELECT 
	idDocumentoRecibido
   ,codDocSustento
   ,numDocSustento
   ,fechaEmisionDocSustento
   ,codigo
   ,baseImponible
   ,porcentajeRetener = CASE WHEN codigo = '2' THEN 12.00 ELSE 0 END
   ,valorRetenido
FROM @devoluciones