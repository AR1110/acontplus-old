--use acontplus
--go
----select * from dbo.SustentoTributario
----select * from sri.SustentoTributario

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'codSustentoTributario'
        AND Object_ID = Object_ID(N'dbo.FacturaCompra')
)
BEGIN
    ALTER TABLE dbo.FacturaCompra ADD codSustentoTributario VARCHAR(2) NULL
END;
GO

DECLARE @TableName NVARCHAR(128) = 'SustentoTributario';

-- To actually execute the drop statements automatically, you could use:
 DECLARE @sql NVARCHAR(MAX);
 
 SELECT @sql = STRING_AGG(
     'ALTER TABLE [' + SCHEMA_NAME(fk.schema_id) + '].[' + OBJECT_NAME(fk.parent_object_id) + '] ' +
     'DROP CONSTRAINT [' + fk.name + '];', CHAR(13) + CHAR(10))
 FROM 
     sys.foreign_keys AS fk
 WHERE 
     OBJECT_NAME(fk.referenced_object_id) = @TableName;
 
 EXEC sp_executesql @sql;

--UPDATE fc SET fc.codSustentoTributario = st.codigo

--FROM dbo.FacturaCompra fc
--	INNER JOIN dbo.SustentoTributario st ON fc.idSustentoTributario = st.idSustentoTributario;

--GO

--DROP TABLE IF EXISTS Sri.ImpuestoRetencion;
--GO

--DROP TABLE IF EXISTS Sri.DocumentoSustento;
--GO

--DROP TABLE IF EXISTS Sri.FormaPago;
--GO

--DROP TABLE IF EXISTS Sri.Pais;
--GO

--DROP TABLE IF EXISTS Sri.ParaisoFiscal;
--GO

--DROP TABLE IF EXISTS Sri.PorcentajeRetIva;
--GO

--DROP TABLE IF EXISTS Sri.SustentoTributario;
--GO

--DROP TABLE IF EXISTS Sri.SujetoRetenido;
--GO

--DROP TABLE IF EXISTS Sri.ConceptoRetencionAir;
--GO

--DROP TABLE IF EXISTS SRI.PorcentajeRetencionAir
--GO

--DROP TABLE IF EXISTS Sri.PorcentajeRetencionIva;
--GO
--DROP TABLE IF EXISTS Sri.TipoPago;
--GO

--DROP TABLE IF EXISTS Sri.DocumentoSustentoTributario;
--GO

--DROP TABLE IF EXISTS Sri.TipoRegimenFE;
--GO
--DROP TABLE IF EXISTS Sri.TipoRegimenFiscalExterior
