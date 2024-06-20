use [Acontplus]
go 


--ALTER TABLE Contabilidad.CuentaPorCobrar ALTER COLUMN idTiempoCredito INT NULL

--ALTER TABLE Contabilidad.CuentaPorCobrar ALTER COLUMN fechaVencimiento DATETIME2 NULL

--ALTER TABLE Contabilidad.CuentaPorCobrar ADD DEFAULT 1 FOR estado

--INSERT INTO Contabilidad.CuentaPorCobrar
--                   (idPuntoEmision,idCliente,codDoc,fechaEmision, idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal, idEntidad, idUsuario,fechaRegistro)
--select nc.idPuntoEmision
--      ,nc.idCliente
--      ,'04'
--      ,nc.fechaEmision
--      ,nc.idEstadoDocumento
--      ,nc.idNotaCredito
--      ,nc.nroDocumento 
--      ,es.estab + '-' + pe.ptoEmi + '-' + [Helper].[F_Auto_Sequential](nroDocumento)
--      ,nc.total
--      ,nc.idEntidad
--      ,nc.idUsuario
--      ,nc.fechaRegistro 
--from NotaCredito nc
--inner join puntoEmision pe on pe.idPuntoEmision = nc.idPuntoEmision
--inner join Sri.Establecimiento es on es.codEstab = pe.codEstab

