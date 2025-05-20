USE [Acontplus]
go 


IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_Cliente_Filtering')   
    DROP INDEX idx_Cliente_Filtering ON dbo.Cliente;  
GO 
CREATE NONCLUSTERED INDEX idx_Cliente_Filtering
ON dbo.Cliente (idEntidad, CustomerId,idUsuario)
GO