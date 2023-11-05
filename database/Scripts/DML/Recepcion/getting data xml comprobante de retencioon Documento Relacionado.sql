use AcontPlus 

DECLARE @idEntidad INT = 9 
DECLARE @identificacionReceptor VARCHAR(20)


SELECT @identificacionReceptor = ruc  FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

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
where codDoc = '07' AND downloaded = 'DE'



DECLARE @mainRet AS TABLE(
idDocumento INT,
versionComp VARCHAR(10),
retenciones XML
)
insert into @mainRet (idDocumento, versionComp, retenciones)
SELECT idDocumento, versionComp,
case when versionComp = '1.0.0' then xmlComp.query('//comprobanteRetencion') else xmlComp.query('//docsSustento/docSustento') end
from @tmp


--select * from @mainRet where versionComp = '2.0.0'
--return


DECLARE @retenciones AS TABLE(
	idDocumentoRecibido INT,
	codDocSustento VARCHAR(5),
	numDocSustento VARCHAR(15),
	fechaEmisionDocSustento VARCHAR(50),
	codigo VARCHAR(5),
	baseImponible NUMERIC(15,5),
	porcentajeRetener NUMERIC(15,5),
	valorRetenido NUMERIC(15,5)
)

DECLARE @impuestos AS TABLE(
	 idDocumento INT 
	,codigo VARCHAR(5)
	,valorRetenido NUMERIC (18,2)
)

INSERT INTO @retenciones(idDocumentoRecibido,codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
SELECT  
  rt.idDocumento
 ,codDocSustento  = X.Y.value('(codDocSustento)[1]','VARCHAR(2)') 
 ,numDocSustento  = X.Y.value('(numDocSustento)[1]','VARCHAR(15)')
 ,fechaEmisionDocSustento = X.Y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)')
 ,codigo          = x.y.value('(codigo)[1]','VARCHAR(2)')
 ,baseImponible = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
 ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
 ,valorRetenido = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
from @mainRet rt 
CROSS APPLY rt.retenciones.nodes('//impuestos/impuesto') x(y) 
WHERE rt.versionComp = '1.0.0'



INSERT INTO @retenciones(idDocumentoRecibido,codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
SELECT  
  rt.idDocumento
 ,codDocSustento  = X.Y.value('(//docSustento/codDocSustento)[1]','VARCHAR(2)') 
 ,numDocSustento  = X.Y.value('(//docSustento/numDocSustento)[1]','VARCHAR(15)')
 ,fechaEmisionDocSustento = X.Y.value('(//docSustento/fechaEmisionDocSustento)[1]','VARCHAR(50)')
 ,codigo = X.Y.value('(codigo)[1]','VARCHAR(5)')
 ,baseImponible = X.Y.value('(baseImponible)[1]','NUMERIC(18,2)')
 ,porcentajeRetener = X.Y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
 ,valorRetenido = X.Y.value('(valorRetenido)[1]','NUMERIC(18,2)')
FROM @mainRet rt 
CROSS APPLY  rt.retenciones.nodes('//docSustento//retenciones/retencion') x(y) 
WHERE rt.versionComp = '2.0.0'


SELECT
	codDocSustento
   ,numDocSustento
   ,fechaEmisionDocSustento
   ,codigo
   ,baseImponible
   ,porcentajeRetener 
   ,valorRetenido
FROM @retenciones r


RETURN
