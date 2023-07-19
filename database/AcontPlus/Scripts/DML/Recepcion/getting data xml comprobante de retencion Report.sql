use [AcontPlus]
go

--select * from Recepcion.DocumentoRecibido where codDoc ='07' and versionComp = '1.0.0'

DECLARE @infoRentecion TABLE(
	xmlInfoRentecion XML
)

DECLARE @headerRetencion TABLE(
	ambiente VARCHAR(15)
	,tipoEmision VARCHAR(15)
	,razonSocial varchar(150)
	,nombreComercial varchar(150)
	,ruc varchar(15)
	,claveAcceso varchar(49)
	,codDoc varchar(4)
	,estab varchar(6)
	,ptoEmi varchar(6)
	,secuencial varchar(10)
	,dirMatriz varchar(150)

     --Info Comp. Ret
    ,fechaEmision varchar(150)
    ,dirEstablecimiento varchar(150)
    ,obligadoContabilidad varchar(150)
    ,razonSocialSujetoRetenido varchar(150)
    ,identificacionSujetoRetenido varchar(150)
    ,periodoFiscal varchar(150)
)

INSERT INTO @infoRentecion (xmlInfoRentecion) 
SELECT xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
FROM Recepcion.DocumentoRecibido ci where idDocumento = 143



--INSERT INTO @headerRetencion 
SELECT 
	ambiente = CASE WHEN x.y.value('(//infoTributaria/ambiente)[1]','varchar(15)') = '2' THEN 'PRODUCCION' ELSE 'PRUEBAS' END
   ,tipoEmision = CASE WHEN x.y.value('(//infoTributaria/tipoEmision)[1]','varchar(15)') = '1' THEN 'NORMAL' ELSE '' END
   ,razonSocial = x.y.value('(//infoTributaria/razonSocial)[1]','varchar(150)')
   ,nombreComercial = x.y.value('(//infoTributaria/nombreComercial)[1]','varchar(150)')
   ,ruc = x.y.value('(//infoTributaria/ruc)[1]','varchar(15)')
   ,claveAcceso = x.y.value('(//infoTributaria/claveAcceso)[1]','varchar(49)')
   ,codDoc = x.y.value('(//infoTributaria/codDoc)[1]','varchar(4)')
   ,estab = x.y.value('(//infoTributaria/estab)[1]','varchar(6)')
   ,ptoEmi = x.y.value('(//infoTributaria/ptoEmi)[1]','varchar(6)')
   ,secuencial = x.y.value('(//infoTributaria/secuencial)[1]','varchar(10)')
   ,dirMatriz = x.y.value('(//infoTributaria/dirMatriz)[1]','varchar(150)')

   --Info Comp. Ret
   ,fechaEmision = x.y.value('(//infoCompRetencion/fechaEmision)[1]','varchar(150)')
   ,dirEstablecimiento = x.y.value('(//infoCompRetencion/dirEstablecimiento)[1]','varchar(150)')
   ,obligadoContabilidad = x.y.value('(//infoCompRetencion/obligadoContabilidad)[1]','varchar(150)')
   ,razonSocialSujetoRetenido = x.y.value('(//infoCompRetencion/razonSocialSujetoRetenido)[1]','varchar(150)')
   ,identificacionSujetoRetenido = x.y.value('(//infoCompRetencion/identificacionSujetoRetenido)[1]','varchar(150)')   
   ,periodoFiscal = x.y.value('(//infoCompRetencion/periodoFiscal)[1]','varchar(150)')   
from @infoRentecion t
CROSS APPLY t.xmlInfoRentecion.nodes('//comprobante/comprobanteRetencion') x(y)



SELECT 
	 codigo          = x.y.value('(codigo)[1]','varchar(150)')
    ,codigoRetencion = x.y.value('(codigoRetencion)[1]','varchar(150)')
    ,baseImponible = x.y.value('(baseImponible)[1]','varchar(150)')
    ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','varchar(150)')
    ,valorRetenido = x.y.value('(valorRetenido)[1]','varchar(150)')
    ,codDocSustento = x.y.value('(codDocSustento)[1]','varchar(150)')
    ,numDocSustento = x.y.value('(numDocSustento)[1]','varchar(150)')
    ,fechaEmisionDocSustento = x.y.value('(fechaEmisionDocSustento)[1]','varchar(150)')
FROM @infoRentecion t
CROSS APPLY t.xmlInfoRentecion.nodes('//comprobante/comprobanteRetencion/impuestos/impuesto') x(y)


SELECT 
	 x.y.value('@nombre','VARCHAR(150)') as nombre
	,x.y.value('.','VARCHAR(150)')  as valor
FROM  @infoRentecion t
CROSS APPLY t.xmlInfoRentecion.nodes('//comprobante/comprobanteRetencion/infoAdicional/*') x(y)


RETURN