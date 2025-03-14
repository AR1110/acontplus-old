use Acontplus
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
