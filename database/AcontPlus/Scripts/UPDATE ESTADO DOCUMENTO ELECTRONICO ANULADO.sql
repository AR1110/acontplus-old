
select * from EstadoPago where codigo = 'A' 
select * from FactElect.EstadoServicio where codigo = 6


--SELECT COUNT(*) FROM Factura WHERE idestadopago = 5

--update de set 
--	de.codEstado = 6
--from DocumentoElectronico de 
--inner join dbo.Factura f ON f.idfactura = de.idDocumento
--where de.codDoc = '01' and f.idestadoPago = 5


--SELECT * FROM LiquidacionCompra WHERE idestadopago = 5

--update de set 
--	de.codEstado = 6
--from DocumentoElectronico de 
--inner join dbo.LiquidacionCompra lc ON lc.idLiquidacionCompra = de.idDocumento
--where de.codDoc = '03' and lc.idestadoPago = 5


--SELECT * FROM NotaCredito WHERE idestadodocumento = 5

--update de set 
--	de.codEstado = 6
--from DocumentoElectronico de 
--inner join dbo.NotaCredito nc ON nc.idNotaCredito = de.idDocumento
--where de.codDoc = '04' and nc.idestadodocumento = 5


--SELECT * FROM RetencionCompra where idestadodocumento = 5

--update de set 
--	de.codEstado = 6
--from DocumentoElectronico de 
--inner join dbo.RetencionCompra rc ON rc.idRetencionCompra = de.idDocumento
--where de.codDoc = '07' and rc.idestadodocumento = 5