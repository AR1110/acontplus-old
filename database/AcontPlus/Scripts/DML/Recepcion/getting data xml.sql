use AcontPlus 

--select * from FacturaCompraDetalle

--DECLARE @idUsuario INT    ,@xmlComp as XML    ,@codDoc VARCHAR(2)   
--,@xmlDoc XML = (sELECT XMLDOC from FactElect.ComprobanteImportacion where numeroAutorizacion = '0501202301179193245500120070010000194230001942311')   
--,@xmlDetails XML   
--select    @xmlDoc.query('//RespuestaAutorizacionComprobante/autorizaciones/autorizacion')  
--SELECT @xmlComp        
--select @xmldoc

--select * from FacturaCompraDetalle where descripcion = 'CEMENTO CTAC.AFRI.132'
DECLARE @tmp as Table(
idDocumento INT,
versionComp VARCHAR(10),
numeroAutorizacion VARCHAR(49),
rucReceptor VARCHAR(50),
numeroDocumento VARCHAR(25),
totalSinImpuestos NUMERIC(18,2),
totalConImpuestos XML,
subtotalIva0 NUMERIC(18,2),
subtotalNetoIva NUMERIC(18,2),
montoIva NUMERIC(18,2),
importeTotal NUMERIC(18,2),
fechaEmision VARCHAR(50),
xmlComp xml,
details xml,
retenciones XML
)

INSERT INTO @tmp(idDocumento, versionComp, rucReceptor, numeroAutorizacion, numeroDocumento
,totalSinImpuestos, totalConImpuestos ,importeTotal, fechaEmision,xmlComp, details)

--UPDATE c SET xmlDoc = 
SELECT TOP 10 ci.idDocumento,
 CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).value('(comprobante/comprobanteRetencion/@version)[1]', 'VARCHAR(10)')

,ci.identificacionReceptor, ci.numeroAutorizacion, ci.serieComprobante


,totalSinImpuestos = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/factura').value('(/factura/infoFactura/totalSinImpuestos)[1]', 'numeric(18,2)')

,totalConImp = 	CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/factura/infoFactura/totalConImpuestos')
,ci.importeTotal
,REPLACE(ci.fechaEmision, '/','-')

,xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))

,CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/factura').query('/factura/detalles')
as detailes
FROM Recepcion.DocumentoRecibido ci
where --ci.complete = 1 --AND numeroAutorizacion = '2601202301179002447400120010020001318610013186113'
--AND  ci.codEstab IN (
--'ESTAB-000000048','ESTAB-000000129'
--)
--AND identificacionReceptor = '0102289790001'
--AND YEAR(CONVERT(DATE, fechaEmision, 103))=2023
--AND MONTH(CONVERT(DATE, fechaEmision, 103))=1
downloaded = 'DE' AND numeroAutorizacion = '0302202307010137401500120030020000022181234567810'

----RETENCIONES 

DECLARE @mainRet AS TABLE(
idDocumento int,
versionComp VARCHAR(10),
retenciones XML
)
insert into @mainRet (idDocumento, versionComp, retenciones)
SELECT idDocumento, versionComp,
case when versionComp = '1.0.0' then xmlComp.query('//impuestos') else xmlComp.query('//docsSustento/docSustento/retenciones/retencion') end
from @tmp

DECLARE @retenciones AS TABLE(
codDocSustento VARCHAR(5),
numDocSustento VARCHAR(15),
fechaEmisionDocSustento VARCHAR(50),
valorRetenido NUMERIC(18,2)
)
INSERT INTO @retenciones(codDocSustento, numDocSustento, fechaEmisionDocSustento, valorRetenido)
select  
X.Y.value('(codDocSustento)[1]','VARCHAR(2)') AS DOC
,X.Y.value('(numDocSustento)[1]','VARCHAR(15)') AS DOC
,X.Y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)') AS DOC
,X.Y.value('(valorRetenido)[1]',' NUMERIC(18,2)') AS DOC

from @mainRet rt CROSS APPLY  rt.retenciones.nodes('//impuesto') x(y)

select * from @retenciones

return
---END RETENCIONES

--SELECT * FROM @TMP WHERE NUMEROAUTORIZACION = '1001202301229033472400120012230000000061234567813'
--RETURN 

DECLARE  @totalConImp AS TABLE(
idDocumento INT 
,codigo VARCHAR(5)
,codigoPorcentaje VARCHAR(5)
,baseImponible NUMERIC(18,2)
,valor NUMERIC(18,2)
)

INSERT INTO @totalConImp(idDocumento, codigo, codigoPorcentaje, baseImponible, valor)
 select 
 t.idDocumento
 ,x.y.value('(codigo)[1]', 'VARCHAR(5)') codigo
 ,x.y.value('(codigoPorcentaje)[1]', 'VARCHAR(5)') codigoPorcentaje
 ,x.y.value('(baseImponible)[1]', ' NUMERIC(18,2)') baseImponible
 ,x.y.value('(valor)[1]', ' NUMERIC(18,2)') valor

 
 from @tmp t cross apply t.totalConImpuestos.nodes('//totalImpuesto') as x(y) 


 select 
 --t.idDocumento
  rucReceptor,
  --numeroAutorizacion,
 numeroDocumento
 ,t.fechaEmision
,totalSinImpuestos

,subtotalIva0 = ISNULL((SELECT SUM(tci.baseImponible) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '2' 
													AND tci.codigoPorcentaje = '0'), 0)
,subtotalNoObjetoIva = ISNULL((SELECT SUM(tci.baseImponible) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '2' 
													AND tci.codigoPorcentaje = '6'), 0)
,subtotalExentoIva = ISNULL((SELECT SUM(tci.baseImponible) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '2' 
													AND tci.codigoPorcentaje = '7'), 0)
,subtotalNetoIva = ISNULL((SELECT SUM(tci.baseImponible) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '2' 
													AND tci.codigoPorcentaje IN ('2', '3', '8')), 0)
,iva = ISNULL((SELECT SUM(tci.valor) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '2' 
													AND tci.codigoPorcentaje IN ('2', '3', '8')), 0)
,ice  = ISNULL((SELECT SUM(tci.valor) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '3'), 0)
,irbpnr  = ISNULL((SELECT SUM(tci.valor) FROM @totalConImp tci 
													where  tci.idDocumento = t.idDocumento 
													AND tci.codigo = '5'), 0)
,importeTotal
,fc.total
 from @tmp t 
 left join FacturaCompra fc ON t.numeroAutorizacion = fc.nroAutorizacion 
 --where t.importeTotal <> fc.total
 GROUP BY  t.idDocumento, rucReceptor, numeroAutorizacion, numeroDocumento
,totalSinImpuestos,importeTotal, t.fechaEmision, fc.total
ORDER BY t.fechaEmision

--SELECT sum( fci.baseImponible), SUM(fci.valor) , T.total, T.totalReal, t.totalSinImpuestos, T.idFacturaCompra, T.numeroAutorizacion  FROM Compra.FacturaCompraImpuesto fci


--JOIN (

--select idFacturaCompraDetalle, fcd.idFacturaCompra, FCC.total, ttt.importeTotal totalReal, ttt.totalSinImpuestos , ttt.numeroAutorizacion
--from FacturaCompraDetalle fcd
--INNER JOIN FACTURACOMPRA FCC on FCD.idFacturaCompra = FCc.idFacturaCompra
--inner  join @tmp  ttt ON FCC.nroAutorizacion = ttt.numeroAutorizacion
--) AS T ON fci.idFac_CompraDetalle = T.idFacturaCompraDetalle
 
-- GROUP BY t.idFacturaCompra, T.total, T.totalReal, T.idFacturaCompra, T.numeroAutorizacion, T.totalSinImpuestos
 --HAVING SUM(fci.baseImponible) <> T.totalSinImpuestos



 --select * from @totalConImp

--select SUM(importeTotal) from @tmp  

--select * from FacturaCompraDetalle where idFacturaCompra = 1359

RETURN


DECLARE @details AS TABLE(
	idDocumento INT,
	codigoPrincipal  VARCHAR(49),
	codigoAuxiliar  VARCHAR(49),
	descripcion VARCHAR(max),
	precioUnitario  numeric(18,5),
	descuento  numeric(18,5),
	precioTotalSinImpuesto  numeric(18,5),
	impuestos XML
)

INSERT INTO @details(idDocumento, codigoPrincipal, codigoAuxiliar, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, impuestos)

--insert into tmpDetailInvoiceRecovery(numeroAutorizacion, codigoPrincipal, codigoAuxiliar, descripcion, precioUnitario, descuento, precioTotalSinImpuesto)

select t.idDocumento
,x.y.value('(codigoPrincipal)[1]', 'varchar(max)') as codigoPrincipal
,x.y.value('(codigoAuxiliar)[1]', 'varchar(max)') as codigoAuxiliar
,x.y.value('(descripcion)[1]', 'varchar(max)') as descripcion
,x.y.value('(precioUnitario)[1]', 'numeric(18,5)') as precioUnitario
,x.y.value('(descuento)[1]', 'numeric(18,5)') as descuento
,x.y.value('(precioTotalSinImpuesto)[1]', 'numeric(18,5)') as precioTotalSinImpuesto
,x.y.query('(impuestos)') as imp

from @tmp t
cross apply t.details.nodes('//detalle') as x(y)


--create TABLE fcdetimptemp(
--	idDocumento INT,
--	codigoPrincipal  VARCHAR(49),
--	codigo VARCHAR(100),
--	codigoPorcentaje  VARCHAR(100),
--	tarifa  VARCHAR(10),
--	baseImponible  numeric(18,5),
--	valor numeric(18,5)
--)

--insert into fcdetimptemp(numeroAutorizacion, codigo, codigoPrincipal, codigoPorcentaje, tarifa, baseImponible, valor)
select t.idDocumento
,t.codigoPrincipal 
,x.y.value('(codigo)[1]', 'VARCHAR(100)') as codigo
,x.y.value('(codigoPorcentaje)[1]', 'VARCHAR(100)') as codigoPorcentaje
,x.y.value('(tarifa)[1]', 'VARCHAR(100)') as tarifa
,x.y.value('(baseImponible)[1]', ' numeric(18,5)') as baseImponible
,x.y.value('(valor)[1]', ' numeric(18,5)') as valor

from @details t
cross apply t.impuestos.nodes('//impuesto') as x(y) ORDER BY codigoPrincipal

declare @mainTable AS TABLE(
idDocumento INT,
numeroAutorizacion VARCHAR(49),
numeroDocumento VARCHAR(15),
subtotalSinImpuestos NUMERIC(18,2),
subtotalNetIva NUMERIC(18,2),
importeTotal NUMERIC(18,2)
)

--SELECT TOP 1 * FROM FactElect.ComprobanteImportacion 