USE Acontplus
GO

UPDATE TipoDocumento SET estado = 0 WHERE estado IS NULL
GO

ALTER TABLE TipoDocumento ALTER COLUMN estado BIT NOT NULL
GO

UPDATE TipoDocumento SET fechaRegistro = dbo.ufnGetDateEcuador() WHERE fechaRegistro IS NULL
GO

ALTER TABLE TipoDocumento ADD DEFAULT GETDATE() FOR fechaRegistro
GO

ALTER TABLE TipoDocumento ALTER COLUMN fechaRegistro DATETIME NOT NULL
GO

UPDATE TipoDocumento SET secuencial = 0 WHERE secuencial IS NULL
GO

ALTER TABLE TipoDocumento ALTER COLUMN secuencial BIT NOT NULL
GO

IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'UI_TipoDocumento_Code'
           AND object_id = OBJECT_ID(N'dbo.TipoDocumento', N'U'))   
   DROP INDEX UI_TipoDocumento_Code ON dbo.TipoDocumento;   
GO
CREATE UNIQUE INDEX UI_TipoDocumento_Code   
   ON dbo.TipoDocumento(codigo);
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_TipoDocumento_Desc_TipoTran_Code_SriCode_Secuence')   
    DROP INDEX IX_TipoDocumento_Desc_TipoTran_Code_SriCode_Secuence ON dbo.TipoDocumento
GO

CREATE NONCLUSTERED INDEX [IX_TipoDocumento_Desc_TipoTran_Code_SriCode_Secuence]
ON [dbo].[TipoDocumento]([idTipoTransaccion] ASC)
INCLUDE ([idTipoDocumento], [codigo], [codigoSri], [secuencial])
GO

INSERT INTO TipoDocumento(descripcion, codigo, secuencial)
VALUES('Order Restaurante', 'OR', 1)
GO