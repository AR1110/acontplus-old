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