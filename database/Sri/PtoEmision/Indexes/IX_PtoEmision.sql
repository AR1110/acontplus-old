USE Acontplus
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_PtoEmision')   
    DROP INDEX IX_PtoEmision ON dbo.PuntoEmision;  
GO
    CREATE NONCLUSTERED INDEX IX_PtoEmision
    ON dbo.PuntoEmision(idEstablecimiento)
    INCLUDE ([ambiente], [ptoEmi])
GO
