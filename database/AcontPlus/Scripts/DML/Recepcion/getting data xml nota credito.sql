use [AcontPlus]
go 


DECLARE @tmp as Table(
idDocumento INT,
versionComp VARCHAR(10) NOT NULL,
xmlComp xml
)

INSERT INTO @tmp(idDocumento,versionComp,xmlComp)
SELECT 
 ci.idDocumento
,versionComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).value('(comprobante/notaCredito/@version)[1]', 'VARCHAR(10)')
,xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
FROM Recepcion.DocumentoRecibido ci
where downloaded = 'DE' AND codDoc = '04' AND complete = 0


select '1','','' 
	 ,r.idDocumento
	,idTipoDocumento = (SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'NCP')
	,serieComprobante
	,saldo = x.y.value('sum(//totalConImpuestos/totalImpuesto/baseImponible) + sum(//totalConImpuestos/totalImpuesto/valor)','NUMERIC(18,2)')
	,codDoc = 'NCP'
	,numDocSustento = x.y.value('(numDocModificado)[1]','VARCHAR(15)')
from @tmp r
CROSS APPLY r.xmlComp.nodes('//comprobante/notaCredito/infoNotaCredito') x(y) 
INNER JOIN Recepcion.DocumentoRecibido dc ON dc.idDocumento = r.idDocumento