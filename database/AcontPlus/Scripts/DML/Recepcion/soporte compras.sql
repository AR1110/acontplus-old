--drop table tmpDetailInvoiceRecovery
--TRUNCATE TABLE  tmpDetailInvoiceRecovery
--create TABLE tmpDetailInvoiceRecovery(
--	numeroAutorizacion VARCHAR(49),
--	codigoPrincipal  VARCHAR(49),
--	codigoAuxiliar  VARCHAR(49),
--	descripcion VARCHAR(max),
--	precioUnitario  numeric(18,5),
--	descuento  numeric(18,5),
--	precioTotalSinImpuesto  numeric(18,5)
--)

select ti.precioUnitario, fcd.precioCosto, fcd.idFacturaCompraDetalle from tmpDetailInvoiceRecovery ti 
INNER JOIN FACTURACOMPRA C ON ti.numeroAutorizacion = c.nroAutorizacion
INNER JOIN FACTURACOMPRADETALLE fcd ON c.idfacturacompra= fcd.idfacturacompra 
AND ti.descripcion = fcd.descripcion
--AND ti.precioUnitario <> fcd.precioCosto
--where ti.numeroAutorizacion = '0701202301099000816700120040050008852909177862914'

--select * from FacturaCompra where nroDocumento = 885290

--select * from Compra.FacturaCompraImpuesto where idFac_CompraDetalle in (

--6121,
--6122,
--6123,
--6124,
--6125,
--6126,
--6127,
--6128,
--6129
--)

--select top 1 * from FactElect.ComprobanteImportacion where codEstab IN (
--'ESTAB-000000048','ESTAB-000000129'
--)

--SELECT * FROM Sri.Establecimiento WHERE ruc = '0102289790001'

select t.numeroAutorizacion
,x.y.value('(codigoPrincipal)[1]', 'varchar(max)') as codigoPrincipal
,x.y.value('(codigoAuxiliar)[1]', 'varchar(max)') as codigoAuxiliar
,x.y.value('(descripcion)[1]', 'varchar(max)') as descripcion
,x.y.value('(precioUnitario)[1]', 'numeric(18,5)') as precioUnitario
,x.y.value('(descuento)[1]', 'numeric(18,5)') as descuento
,x.y.value('(precioTotalSinImpuesto)[1]', 'numeric(18,5)') as precioTotalSinImpuesto
,x.y.query('(impuestos)') as imp

from @tmp t
cross apply t.details.nodes('//detalle') as x(y)

--alter table FACTURACOMPRADETALLE add codigoPrincipal VARCHAR(100)
--alter table FACTURACOMPRADETALLE add codigoAuxiliar VARCHAR(100)

--update fcddd set
----fcddd.precioCosto = t.precioUnitario
----,fcddd.total = t.precioTotalSinImpuesto
--fcddd.codigoPrincipal = t.codigoPrincipal
--,fcddd.codigoAuxiliar = t.codigoAuxiliar
--FROM FACTURACOMPRADETALLE fcddd
--join (
--select ti.precioUnitario, fcd.precioCosto, fcd.idFacturaCompraDetalle, ti.precioTotalSinImpuesto, ti.codigoPrincipal, ti.codigoAuxiliar
--from tmpDetailInvoiceRecovery ti 
--INNER JOIN FACTURACOMPRA C ON ti.numeroAutorizacion = c.nroAutorizacion
--INNER JOIN FACTURACOMPRADETALLE fcd ON c.idfacturacompra= fcd.idfacturacompra 
--AND ti.descripcion = fcd.descripcion
--) as t ON fcddd.idFacturaCompraDetalle = t.idFacturaCompraDetalle

--UPDATE FCI set FCI.baseImponible = t.precioTotalSinImpuesto

--FROM Compra.FacturaCompraImpuesto FCI
--JOIN (
--select ti.precioUnitario, fcd.precioCosto, fcd.idFacturaCompraDetalle, ti.precioTotalSinImpuesto 
--from tmpDetailInvoiceRecovery ti 
--INNER JOIN FACTURACOMPRA C ON ti.numeroAutorizacion = c.nroAutorizacion
--INNER JOIN FACTURACOMPRADETALLE fcd ON c.idfacturacompra= fcd.idfacturacompra 
--AND ti.descripcion = fcd.descripcion

--) as t ON FCI.idFac_CompraDetalle = t.idFacturaCompraDetalle

select ti.precioUnitario, fcd.precioCosto, fcd.idFacturaCompraDetalle, ti.precioTotalSinImpuesto 
from tmpDetailInvoiceRecovery ti 
INNER JOIN FACTURACOMPRA C ON ti.numeroAutorizacion = c.nroAutorizacion
left JOIN FACTURACOMPRADETALLE fcd ON c.idfacturacompra= fcd.idfacturacompra 
AND ti.descripcion = fcd.descripcion
where ti.numeroAutorizacion = '2601202301179002447400120010020001318610013186113'
--create TABLE fcdetimptemp(
--	numeroAutorizacion VARCHAR(49),
--	codigoPrincipal  VARCHAR(49),
--	codigo VARCHAR(100),
--	codigoPorcentaje  VARCHAR(100),
--	tarifa  VARCHAR(10),
--	baseImponible  numeric(18,5),
--	valor numeric(18,5)
--)


--insert into fcdetimptemp(numeroAutorizacion,codigoPrincipal, codigo,  codigoPorcentaje, tarifa, baseImponible, valor)
select t.numeroAutorizacion
,t.codigoPrincipal 
,x.y.value('(codigo)[1]', 'VARCHAR(100)') as codigo
,x.y.value('(codigoPorcentaje)[1]', 'VARCHAR(100)') as codigoPorcentaje
,x.y.value('(tarifa)[1]', 'VARCHAR(100)') as tarifa
,x.y.value('(baseImponible)[1]', ' numeric(18,5)') as baseImponible
,x.y.value('(valor)[1]', ' numeric(18,5)') as valor

from @details t
cross apply t.impuestos.nodes('//impuesto') as x(y)

SELECT * FROM FactElect.ComprobanteImportacion WHERE numeroAutorizacion = '1901202301179139983800120011010002416976711803016'
select * from FacturaCompra fc
inner join Proveedor p ON fc.idProveedor = p.idProveedor 
where nroDocumento = 241697 and p.numeroIdentificacion = '2290334724001'

select * from FacturaCompraDetalle where idFacturaCompra = 1668

select * from FacturaCompraDetalle where idFacturaCompra = 1415


--select *  from Compra.FacturaCompraImpuesto FCI where idFac_CompraDetalle IN ( select idFacturaCompraDetalle

--from FacturaCompraDetalle where idFacturaCompra = 1292)

--select cast(round((baseImponible * (tarifa/100)), 2,1) as numeric(18,2)),
--valor from Compra.FacturaCompraImpuesto where cast(round((baseImponible * (tarifa/100)), 2,1) as numeric(18,2)) != cast(round((valor), 2,1) as numeric(18,2))
--update Compra.FacturaCompraImpuesto set valor = 18.21 where idFac_Comp_Imp = 5043
--select * 
from Compra.FacturaCompraImpuesto fcddddddd
JOIN  (
select fcd.idFacturaCompraDetalle, FCIII.valor
from tmpDetailInvoiceRecovery ti 
INNER JOIN FACTURACOMPRA C ON ti.numeroAutorizacion = c.nroAutorizacion
INNER JOIN FACTURACOMPRADETALLE fcd ON c.idfacturacompra= fcd.idfacturacompra 
--AND ti.descripcion = fcd.descripcion
left JOIN fcdetimptemp FCIII on ti.numeroAutorizacion = FCIII.numeroAutorizacion
and  ti.codigoPrincipal = FCIII.codigoPrincipal
where fcd.idFacturaCompraDetalle = 5797) AS T ON T.idFacturaCompraDetalle = fcddddddd.idFac_CompraDetalle
--select * from fcdetimptemp

--truncate table fcdetimptemp

update Compra.FacturaCompraImpuesto set baseimponible = 36.86, valor = 4.42  where idFac_CompraDetalle	IN (
 
7674

) 

--ORDER BY idFac_CompraDetalle

SELECT * FROM FacturaCOMPRADetalle WHERE IDFACTURACOMPRADETALLE IN (7674)

--UPDATE FacturaCompraDetalle SET total = 36.86, iva = 4.42 WHERE idFacturaCompraDetalle = 7674