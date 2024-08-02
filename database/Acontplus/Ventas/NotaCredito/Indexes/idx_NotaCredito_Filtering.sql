use [Acontplus]
go 


IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_NotaCredito_Filtering')   
    DROP INDEX idx_NotaCredito_Filtering ON dbo.NotaCredito;  
GO 
CREATE NONCLUSTERED INDEX idx_NotaCredito_Filtering
ON dbo.NotaCredito (idNotaCredito, idFactura, idCliente, idUsuario,idDocumentoElectronico)
INCLUDE (estado);
GO