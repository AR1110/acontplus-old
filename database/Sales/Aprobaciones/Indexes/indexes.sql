USE AcontPlus;  
GO  
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Aprobacion_Doc')   
    DROP INDEX IX_Aprobacion_Doc ON Ventas.Aprob_Document;  
GO
    CREATE NONCLUSTERED INDEX IX_Aprobacion_Doc
    ON  Ventas.Aprob_Document(idCliente,idUsuario,idPuntoEmision,idTipoDocumento,idTipoDocOrigen,UpdatedByUserId,idEstadoDocumento)
    INCLUDE (fechaEmision,secuencial,claveAcceso,estado)
GO

