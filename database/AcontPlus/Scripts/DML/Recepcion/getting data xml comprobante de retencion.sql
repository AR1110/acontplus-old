use AcontPlus 

DECLARE @tmp as Table(
idDocumento INT,
versionComp VARCHAR(10) NOT NULL,
xmlComp xml
)

INSERT INTO @tmp(idDocumento,versionComp,xmlComp)
SELECT 
 ci.idDocumento
,versionComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).value('(comprobante/comprobanteRetencion/@version)[1]', 'VARCHAR(10)')
,xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
FROM Recepcion.DocumentoRecibido ci
where idDocumento = 142



SELECT 
	ambiente = CASE WHEN x.y.value('(//infoTributaria/ambiente)[1]','varchar(15)') = '2' THEN 'PRODUCCION' ELSE 'PRUEBAS' END
   ,tipoEmision = CASE WHEN x.y.value('(//infoTributaria/tipoEmision)[1]','varchar(15)') = '1' THEN 'NORMAL' ELSE '' END
   ,razonSocial = x.y.value('(//infoTributaria/razonSocial)[1]','varchar(150)')
   ,nombreComercial = x.y.value('(//infoTributaria/nombreComercial)[1]','varchar(150)')
   ,ruc = x.y.value('(//infoTributaria/ruc)[1]','varchar(15)')
from @tmp t
CROSS APPLY t.xmlComp.nodes('//comprobante/comprobanteRetencion') x(y)
RETURN
----RETENCIONES 

DECLARE @mainRet AS TABLE(
idDocumento INT,
versionComp VARCHAR(10),
retenciones XML
)
insert into @mainRet (idDocumento, versionComp, retenciones)
SELECT idDocumento, versionComp,
case when versionComp = '1.0.0' then xmlComp.query('//comprobanteRetencion') else xmlComp.query('//docsSustento/docSustento') end
from @tmp


DECLARE @retenciones AS TABLE(
idDocumento INT,
codDocSustento VARCHAR(5),
numDocSustento VARCHAR(15),
fechaEmisionDocSustento VARCHAR(50),
valorRetenido NUMERIC(18,2)
)

INSERT INTO @retenciones(idDocumento,codDocSustento, numDocSustento, fechaEmisionDocSustento, valorRetenido)
SELECT  
  rt.idDocumento
 ,X.Y.value('(//impuesto/codDocSustento)[1]','VARCHAR(2)') AS codDocSustento
 ,X.Y.value('(//impuesto/numDocSustento)[1]','VARCHAR(15)') AS numDocSustento
 ,X.Y.value('(//impuesto/fechaEmisionDocSustento)[1]','VARCHAR(50)') AS fechaEmisionDocSustento
 ,X.Y.value('sum(//impuesto/valorRetenido)[1]',' NUMERIC(18,2)') AS valorRetenido
from @mainRet rt 
CROSS APPLY rt.retenciones.nodes('//impuestos') x(y) 
WHERE rt.versionComp = '1.0.0'

INSERT INTO @retenciones(idDocumento,codDocSustento, numDocSustento, fechaEmisionDocSustento, valorRetenido)
SELECT  
  rt.idDocumento
 ,X.Y.value('(codDocSustento)[1]','VARCHAR(2)') AS codDocSustento
 ,X.Y.value('(numDocSustento)[1]','VARCHAR(15)') AS numDocSustento
 ,X.Y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)') AS fechaEmisionDocSustento
 ,X.Y.value('sum(//retenciones/retencion/valorRetenido)', 'NUMERIC(18,2)') as valorRetenido
FROM @mainRet rt 
CROSS APPLY  rt.retenciones.nodes('//docSustento') x(y) 
WHERE rt.versionComp = '2.0.0'



SELECT '1','',''
	,r.idDocumento
	,idTipoDocumento = (SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'RV')
	,dr.serieComprobante
	,saldo = r.valorRetenido
	,codDoc = 'RV'
	,nroDoc = SUBSTRING(r.numDocSustento,1,3)+'-'+SUBSTRING(r.numDocSustento,4,3)+'-'+SUBSTRING(r.numDocSustento,7,9)
FROM  @retenciones r
INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = r.idDocumento

RETURN
