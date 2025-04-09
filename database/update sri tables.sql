USE Acontplus
GO
--DESPUES DE LAS MIGRACIONES

UPDATE fc SET fc.idSustentoTributario = st.Id

FROM dbo.FacturaCompra fc
	INNER JOIN Sri.SustentoTributario st
		ON fc.codSustentoTributario = st.codigo

GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'fk_factura_compra_sustento_tributario'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_NAME = 'FacturaCompra'
)
BEGIN
    ALTER TABLE dbo.FacturaCompra
    ADD CONSTRAINT fk_factura_compra_sustento_tributario
    FOREIGN KEY (idSustentoTributario)
    REFERENCES Sri.SustentoTributario(Id)
END
GO

IF NOT EXISTS (SELECT 1 FROM Sri.DocumentoSustentoTributario)
    BEGIN
        INSERT INTO Sri.DocumentoSustentoTributario(TipoComprobanteId, SustentoTributarioId)
        SELECT (SELECT Id FROM Sri.TipoComprobante WHERE Codigo = '01')
        ,st.Id
        FROM Sri.DocumentoSustentoTrib dtt 
        INNER JOIN Sri.SustentoTributario st ON dtt.codSustento = st.Codigo
    END

IF EXISTS (SELECT 1 FROM Sri.DocumentoSustentoTributario)
    BEGIN
        DROP TABLE IF EXISTS Sri.DocumentoSustentoTrib;
    END

UPDATE ratsp SET ratsp.formaPagoId = fp.Id
FROM FactElect.RetencionAtsPago ratsp
	INNER JOIN Sri.FormaPago fp ON ratsp.formaPago = fp.codigo
GO

ALTER TABLE FactElect.RetencionAtsPago ALTER COLUMN formaPagoId INT NOT NULL;
GO

IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsPago WHERE formaPagoId IS NOT NULL)
    BEGIN 
        ALTER TABLE FactElect.RetencionAtsPago DROP COLUMN IF EXISTS formaPago;
    END



UPDATE rat SET rat.impuestoRetencionId = ir.Id
FROM FactElect.RetencionAtsRet rat
	INNER JOIN Sri.ImpuestoRetencion ir ON rat.codigo = ir.codigo
GO

ALTER TABLE FactElect.RetencionAtsRet ALTER COLUMN impuestoRetencionId INT NOT NULL;
GO

IF EXISTS (SELECT 1 FROM FactElect.RetencionAtsRet WHERE impuestoRetencionId IS NOT NULL)
    BEGIN 
        ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS codigo;
    END
GO

ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS fechaPagoDiv;
GO

ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS imRentaSoc;
GO

ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS ejerFisUtDiv;
GO
     
ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS numCajBan;
GO

ALTER TABLE FactElect.RetencionAtsRet DROP COLUMN IF EXISTS precCajBan;
GO

DELETE FROM FactElect.RetAtsImpDocSustento where idRetAtsImpDocSustento = 199
GO

UPDATE ratids SET ratids.idTarifaImpuesto = ti.idTarifaImpuesto
FROM FactElect.RetAtsImpDocSustento ratids
	INNER JOIN Sri.TarifaImpuesto ti ON ratids.codigoPorcentaje = ti.codigo AND ratids.codImpuestoDocSustento = ti.codImpuesto
GO


ALTER TABLE FactElect.RetAtsImpDocSustento ALTER COLUMN idTarifaImpuesto INT NOT NULL;
GO

IF EXISTS (SELECT 1 FROM FactElect.RetAtsImpDocSustento WHERE idTarifaImpuesto IS NOT NULL)
    BEGIN
        ALTER TABLE FactElect.RetAtsImpDocSustento DROP COLUMN IF EXISTS codImpuestoDocSustento;
        ALTER TABLE FactElect.RetAtsImpDocSustento DROP COLUMN IF EXISTS codigoPorcentaje;
        ALTER TABLE FactElect.RetAtsImpDocSustento DROP COLUMN IF EXISTS tarifa;
        ALTER TABLE Sri.TarifaImpuesto DROP COLUMN IF EXISTS codImpuesto;
    END
GO

SELECT (SELECT dst.Id FROM Sri.DocumentoSustentoTributario dst 
WHERE dst.TipoComprobanteId = (SELECT tc.Id FROM Sri.TipoComprobante tc WHERE tc.Codigo = ratds.codDocSustento)
	AND dst.SustentoTributarioId = (SELECT st.Id FROM Sri.SustentoTributario st WHERE st.Codigo = ratds.codSustento)
) as documentoSustentoTributarioId, ratds.idRetAtsDocSustento

INTO #dst
FROM FactElect.RetAtsDocSustento ratds
GO

UPDATE ratds SET ratds.documentoSustentoTributarioId = dst.documentoSustentoTributarioId
FROM FactElect.RetAtsDocSustento ratds
INNER JOIN #dst dst ON ratds.idRetAtsDocSustento = dst.idRetAtsDocSustento
GO

DROP TABLE IF EXISTS #dst
GO

DELETE FROM FactElect.RetAtsImpDocSustento WHERE idRetAtsDocSustento IN (7000,7107)
GO
DELETE FROM FactElect.RetencionAtsRet WHERE idRetAtsDocSustento IN (7000,7107)
GO
DELETE FROM FactElect.RetencionAtsPago WHERE idRetAtsDocSustento IN (7000,7107)
GO
DELETE FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento IN (7000,7107)
GO

ALTER TABLE FactElect.RetAtsDocSustento ALTER COLUMN documentoSustentoTributarioId INT NOT NULL
GO

IF EXISTS (SELECT 1 FROM FactElect.RetAtsDocSustento WHERE documentoSustentoTributarioId IS NOT NULL)
    BEGIN
        ALTER TABLE FactElect.RetAtsDocSustento DROP COLUMN IF EXISTS codSustento
        ALTER TABLE FactElect.RetAtsDocSustento DROP COLUMN IF EXISTS codDocSustento
    END
GO

UPDATE ratds SET ratds.tipoRegimenFiscalExteriorId = trfe.Id
FROM FactElect.RetAtsDocSustento ratds
    INNER JOIN Sri.TipoRegimenFiscalExterior trfe ON ratds.tipoRegi = trfe.Codigo
WHERE ratds.tipoRegi IS NOT NULL
GO

ALTER TABLE FactElect.RetAtsDocSustento DROP COLUMN IF EXISTS tipoRegi
GO


