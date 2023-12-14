--Use Acontplus
--go
--IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'uuid' AND Object_ID = Object_ID(N'ApiPrinter.Impresora'))
--	ALTER TABLE ApiPrinter.Impresora ADD uuid UNIQUEIDENTIFIER
--GO
--IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'uuid' AND Object_ID = Object_ID(N'ApiPrinter.Config_Document'))
--	ALTER TABLE ApiPrinter.Config_Document ADD uuid UNIQUEIDENTIFIER
--GO

--UPDATE ApiPrinter.Impresora SET uuid = NEWID()
--GO

--UPDATE cd SET cd.uuid = i.uuid

--FROM  ApiPrinter.Config_Document cd
--	INNER JOIN ApiPrinter.Impresora i ON cd.idImpresora = i.idImpresora

--GO
--IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'uuid' AND Object_ID = Object_ID(N'Config.Printer'))
--	ALTER TABLE Config.Printer ADD uuid UNIQUEIDENTIFIER
--GO

--INSERT INTO Config.Printer([PrinterTypeId], [EstablecimientoId], [Name], [IpAddress], [IsDefault], [Machine], [CreatedAt], [Enabled], [UserId], uuid)
--SELECT pt.Id, e.idEstablecimiento, i.nombreImpresora, ISNULL(i.ipMaquina, '127.0.0.1:9100'), ISNULL(i.predeterminada,0), ISNULL(i.nombreEquipo,'N/A'), i.fechaRegistro, i.estado, i.idUsuario, i.uuid 
--FROM ApiPrinter.Impresora i WITH (NOLOCK) 
--INNER JOIN ApiPrinter.TipoImpresora ti ON i.idTipoImpresora = ti.idTipoImpresora
--INNER JOIN Config.PrinterType pt ON ti.codigo = pt.Code
--INNER JOIN Sri.Establecimiento e ON i.codEstab = e.codEstab
--GO

--INSERT INTO Config.PrinterDocument ([PrinterId], [CodDoc], [Copies], [CreatedAt], [Enabled])
--SELECT p.Id, cd.CodDoc, cd.copyPrint, getDate(), estado  FROM ApiPrinter.Config_Document cd 
--INNER JOIN Config.Printer p WITH(NOLOCK) ON cd.uuid = p.uuid
--GO

--ALTER TABLE Config.Printer DROP COLUMN uuid
--GO
 
