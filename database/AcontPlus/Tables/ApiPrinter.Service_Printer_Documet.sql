USE [AcontPlus]
GO

 --DROP TABLE ApiPrinter.Service_Printer_Document
 --GO

CREATE TABLE ApiPrinter.Service_Printer_Document
(
	idService_Printer_Document UNIQUEIDENTIFIER NOT NULL
   ,numEstab VARCHAR(10) NOT NULL
   ,ruc VARCHAR(20) NOT NULL
   ,nombreEquipo VARCHAR(200)NOT NULL
   ,idTipoDocumento BIGINT FOREIGN KEY REFERENCES dbo.TipoDocumento(idTipoDocumento) NOT NULL
   ,idComprobante INT NOT NULL
   ,rdlcProps VARCHAR(MAX) NULL
   ,rdlcParams VARCHAR(MAX) NULL
   ,dataSources VARCHAR(MAX) NULL
   ,fechaRegistro DATETIME NOT NULL
)