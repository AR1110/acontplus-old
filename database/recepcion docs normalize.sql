use acontplus
go
--SELECT TOP 1 * FROM Recepcion.DocumentoRecibido
IF EXISTS (SELECT 1 
           FROM sys.columns 
           WHERE Name = N'codEstab' AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido'))
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    DROP COLUMN codEstab;
END;
GO

IF EXISTS (SELECT 1 
           FROM sys.columns 
           WHERE Name = N'numeroAutorizacion' AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido'))
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    DROP COLUMN numeroAutorizacion;
END;
GO


IF EXISTS (SELECT 1 
           FROM sys.columns 
           WHERE Name = N'xmlDoc' AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido'))
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    DROP COLUMN xmlDoc;
END;
GO

IF EXISTS (SELECT 1
           FROM sys.columns 
           WHERE Name = N'tipoEmision' AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido'))
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    DROP COLUMN tipoEmision;
END;
GO

IF NOT EXISTS (SELECT 1 
           FROM sys.columns 
           WHERE Name = N'customerId' AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido'))
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    ADD customerId INT
END;
GO


IF NOT EXISTS (SELECT 1 
           FROM sys.foreign_keys AS fk
           INNER JOIN sys.foreign_key_columns AS fkc 
               ON fk.object_id = fkc.constraint_object_id
           INNER JOIN sys.columns AS col
               ON fkc.parent_column_id = col.column_id AND fkc.parent_object_id = col.object_id
           WHERE col.name = N'subcategoryId' 
           AND OBJECT_NAME(fk.parent_object_id) = N'DocumentoRecibido'
           AND OBJECT_SCHEMA_NAME(fk.parent_object_id) = N'Recepcion')
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    ADD CONSTRAINT fk_doc_received_subcategory
    FOREIGN KEY (subcategoryId)
    REFERENCES Contabilidad.Subcategory(Id)
END
GO

IF NOT EXISTS (SELECT 1 
           FROM sys.foreign_keys AS fk
           INNER JOIN sys.foreign_key_columns AS fkc 
               ON fk.object_id = fkc.constraint_object_id
           INNER JOIN sys.columns AS col
               ON fkc.parent_column_id = col.column_id AND fkc.parent_object_id = col.object_id
           WHERE col.name = N'customerId' 
           AND OBJECT_NAME(fk.parent_object_id) = N'DocumentoRecibido'
           AND OBJECT_SCHEMA_NAME(fk.parent_object_id) = N'Recepcion')
BEGIN
    ALTER TABLE Recepcion.DocumentoRecibido
    ADD CONSTRAINT fk_doc_received_customer
    FOREIGN KEY (customerId)
    REFERENCES Customer.Customer(Id)
END
GO


UPDATE dr SET dr.customerId = c.Id
FROM Recepcion.DocumentoRecibido dr WITH(ROWLOCK)
INNER JOIN Customer.Customer c WITH(NOLOCK) ON LTRIM(RTRIM(dr.rucEmisor)) = LTRIM(RTRIM(c.IDCard))
GO


INSERT INTO Customer.Customer([IDType], [IDCard], [BusinessName], [SriValidation], [businessNameUpdated])
SELECT 
    CASE WHEN LEN(LTRIM(RTRIM(rucEmisor))) = 10 THEN '05'
        WHEN LEN(LTRIM(RTRIM(rucEmisor))) = 13 THEN '04'
        ELSE '06'
    END,
    rucEmisor, razonSocialEmisior, CAST(1 AS bit), CAST(1 AS bit)
FROM Recepcion.DocumentoRecibido WITH(NOLOCK)
WHERE customerId is null
 AND rucEmisor IS NOT NULL
 AND razonSocialEmisior IS NOT NULL
 GROUP BY  rucEmisor, razonSocialEmisior

UPDATE dr SET dr.customerId = c.Id
FROM Recepcion.DocumentoRecibido dr WITH(ROWLOCK)
INNER JOIN Customer.Customer c WITH(NOLOCK) ON LTRIM(RTRIM(dr.rucEmisor)) = LTRIM(RTRIM(c.IDCard))
WHERE dr.customerId IS NULL
    AND rucEmisor IS NOT NULL
    AND razonSocialEmisior IS NOT NULL
GO