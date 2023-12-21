--use Acontplus
--go
--IF NOT EXISTS (
--    SELECT 1 
--    FROM sys.columns 
--    WHERE Name = N'xmlCompressed'  
--    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
--)
--	ALTER TABLE dbo.DocumentoElectronico ADD xmlCompressed VARBINARY(MAX) NULL
--GO

--UPDATE de SET de.xmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), xmlSri))

--from Acontplus.dbo.DocumentoElectronico de WITH (ROWLOCK)
--where xmlSri IS NOT NULL
--GO

--UPDATE dbo.DocumentoElectronico SET xmlAcontPlus = NULL
--GO

--UPDATE dbo.DocumentoElectronico SET xmlSri = NULL WHERE xmlCompressed IS NOT NULL
--GO

--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.columns 
--    WHERE Name = N'xmlCompressed'  
--    AND Object_ID = Object_ID(N'Recepcion.DocumentoRecibido')
--)
--	ALTER TABLE Recepcion.DocumentoRecibido ADD xmlCompressed VARBINARY(MAX) NULL
--GO

--UPDATE dr SET dr.xmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), xmlDoc))
--from Acontplus.Recepcion.DocumentoRecibido dr WITH (ROWLOCK)
--where xmlDoc IS NOT NULL
--GO
 
--UPDATE Recepcion.DocumentoRecibido SET xmlDoc = NULL WHERE xmlCompressed IS NOT NULL
--GO

