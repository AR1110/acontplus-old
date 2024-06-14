--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_CuentaPorCobrar_Filtering')   
--    DROP INDEX idx_CuentaPorCobrar_Filtering ON Contabilidad.CuentaPorCobrar;  
--GO 
--CREATE NONCLUSTERED INDEX idx_CuentaPorCobrar_Filtering
--ON Contabilidad.CuentaPorCobrar (idPuntoEmision, idTiempoCredito, idCliente, idEntidad, idEstadoPago, idUsuario)
--INCLUDE (codDoc, fechaEmision, idDocumento, fechaVencimiento, serieComprobante, estado, secuencial);
--GO

						
--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_EstadoPago_Codigo')   
--    DROP INDEX idx_EstadoPago_Codigo ON dbo.EstadoPago;  
--GO 
--CREATE NONCLUSTERED INDEX idx_EstadoPago_Codigo
--ON dbo.EstadoPago (codigo);
--GO