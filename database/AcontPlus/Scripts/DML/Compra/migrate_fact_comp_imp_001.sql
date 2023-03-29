USE AcontPlus
GO
--INSERT INTO Compra.FacturaCompraImpuesto(idFac_CompraDetalle, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
--SELECT  idFacturaCompraDetalle, codigo, codigoPorcentaje, tarifa, baseImponible, valor FROM CompraS.FacturaCompraImpuesto
--GO
--DROP TABLE CompraS.FacturaCompraImpuesto
--GO
--DROP SCHEMA CompraS
--GO

INSERT INTO Compra.FacturaCompraImpuesto(idFac_CompraDetalle, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
SELECT idFacturaCompraDetalle, i.codigo, ti.codigoPorcentaje, CONVERT(VARCHAR, CAST(ti.porcentaje AS INT)), fcd.precioCosto, fcd.iva  FROM facturacompradetalle fcd 
INNER JOIN Articulo a ON fcd.idArticulo = a.idArticulo
INNER JOIN TipoIva ti ON fcd.idTipoIva = ti.idTipoIva
INNER JOIN Impuesto i ON ti.idImpuesto = i.idImpuesto
WHERE idFacturacompradetalle not in (
SELECT idFac_CompraDetalle FROM Compra.FacturaCompraImpuesto
)
AND (ice IS NULL OR ICE = 0) 

GO
INSERT INTO Compra.FacturaCompraImpuesto(idFac_CompraDetalle, codigo, codigoPorcentaje, tarifa, baseImponible, valor)

SELECT idFacturaCompraDetalle, 3, tic.codigo, CONVERT(VARCHAR, CAST(tic.porcentaje AS INT)), fcd.precioCosto, fcd.iva  FROM facturacompradetalle fcd 
INNER JOIN Articulo a ON fcd.idArticulo = a.idArticulo
INNER JOIN TipoIva ti ON fcd.idTipoIva = ti.idTipoIva
INNER JOIN Impuesto i ON ti.idImpuesto = i.idImpuesto
INNER JOIN TipoIce tic ON a.idTipoIce = tic.idTipoIce
WHERE idFacturacompradetalle not in (
SELECT idFac_CompraDetalle FROM Compra.FacturaCompraImpuesto
)
AND ice > 0

--select * from Impuesto