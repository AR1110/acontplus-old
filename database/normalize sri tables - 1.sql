USE Acontplus
GO

--MIGRAR PRIMERO - ORDEN 1

ALTER TABLE FactElect.RetencionAts DROP COLUMN IF EXISTS idCliente
GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'fk_retencion_ats_usuario'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_NAME = 'FactElect.RetencionAts'
)
BEGIN
    ALTER TABLE FactElect.RetencionAts
    ADD CONSTRAINT fk_retencion_ats_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES dbo.Usuario(idUsuario)
END
GO

ALTER TABLE FactElect.RetencionAts ALTER COLUMN idUsuario INT NOT NULL;
GO



IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'idImpuesto'
        AND Object_ID = Object_ID(N'Sri.TarifaImpuesto')
)
BEGIN
	ALTER TABLE Sri.TarifaImpuesto 
	ADD idImpuesto INT
	CONSTRAINT fk_impuesto_tarifa 
	FOREIGN KEY (idImpuesto) REFERENCES Sri.Impuesto(idImpuesto)
END
GO

UPDATE ti SET ti.idImpuesto = i.idImpuesto
FROM Sri.TarifaImpuesto ti
	INNER JOIN Sri.Impuesto i ON ti.codImpuesto = i.codigo
GO

ALTER TABLE Sri.TarifaImpuesto ALTER COLUMN idImpuesto INT NOT NULL;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'idTarifaImpuesto'
        AND Object_ID = Object_ID(N'FactElect.RetAtsImpDocSustento')
)
BEGIN
	ALTER TABLE FactElect.RetAtsImpDocSustento 
	ADD idTarifaImpuesto INT
	CONSTRAINT fk_ret_ats_imp_doc_sust_tax_fee
	FOREIGN KEY (idTarifaImpuesto) REFERENCES Sri.TarifaImpuesto(idTarifaImpuesto)
END
GO


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

UPDATE fc SET fc.codSustentoTributario = st.codigo

FROM dbo.FacturaCompra fc
	INNER JOIN dbo.SustentoTributario st ON fc.idSustentoTributario = st.idSustentoTributario;

GO

DROP TABLE IF EXISTS Sri.ImpuestoRetencion;
GO

DROP TABLE IF EXISTS Sri.DocumentoSustento;
GO

DROP TABLE IF EXISTS Sri.FormaPago;
GO

DROP TABLE IF EXISTS Sri.Pais;
GO

DROP TABLE IF EXISTS Sri.ParaisoFiscal;
GO

DROP TABLE IF EXISTS Sri.PorcentajeRetIva;
GO

DROP TABLE IF EXISTS Sri.SustentoTributario;
GO

DROP TABLE IF EXISTS Sri.SujetoRetenido;
GO

DROP TABLE IF EXISTS Sri.ConceptoRetencionAir;
GO

DROP TABLE IF EXISTS SRI.PorcentajeRetencionAir
GO

DROP TABLE IF EXISTS Sri.PorcentajeRetencionIva;
GO
DROP TABLE IF EXISTS Sri.TipoPago;
GO

DROP TABLE IF EXISTS Sri.DocumentoSustentoTributario;
GO

DROP TABLE IF EXISTS Sri.TipoRegimenFE;
GO
DROP TABLE IF EXISTS Sri.TipoRegimenFiscalExterior
GO 
DROP TABLE IF EXISTS Sri.TipoComprobante;
GO
DROP TABLE IF EXISTS Sri.TipoIdentificacionProveedor;
GO
--DELETE FROM Acontplus.dbo.__EFMigrationsHistory WHERE MigrationId = '20250408220329_SriTables'