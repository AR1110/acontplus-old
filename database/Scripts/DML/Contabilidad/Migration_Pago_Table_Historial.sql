USE [Acontplus]
go 

DECLARE @table AS TABLE(

	 idComprobanteEgreso INT NOT NULL
	,abono  NUMERIC(18,5) NOT NULL
	,codDoc VARCHAR(5) NOT NULL
	,uniqueId VARCHAR(20)
)

insert into @table(idComprobanteEgreso,abono,codDoc,uniqueId)
select idComprobanteEgreso,pd.abono,td.codigo,uniqueId = CASE td.codigo WHEN 'FC' THEN (SELECT TOP 1 fc.uniqueId FROM dbo.FacturaCompra fc WHERE fc.idFacturaCompra = pd.idComprobante) 
												    WHEN 'LC' THEN (SELECT TOP 1 lc.uniqueId FROM dbo.LiquidacionCompra lc WHERE lc.idLiquidacionCompra = pd.idComprobante)
												    WHEN 'IB' THEN (SELECT TOP 1 ib.uniqueId FROM dbo.IngresoBodega ib WHERE ib.idIngresoBodega = pd.idComprobante)
						  END 
from PagoDocumento pd 
INNER JOIN TipoDocumento td ON td.idTipoDocumento = pd.idTipoDocumento

INSERT INTO Contabilidad.Historial_Pago(idComprobanteEgreso,idCuentaPorPagar,abono)
select t.idComprobanteEgreso,cp.idCuentaPorPagar,t.abono
from @table t
INNER JOIN Contabilidad.CuentaPorPagar cp ON cp.uniqueId = t.uniqueId
where t.uniqueId IS NOT NULL