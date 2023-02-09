CREATE TABLE ApiPrinter.Service_Printer_Document
(
	  idService_Printer_Document UNIQUEIDENTIFIER NOT NULL
   ,numEstab VARCHAR(10)
   ,ruc VARCHAR(20) 
   ,rdlcProps VARCHAR(MAX)
   ,rdlcParams VARCHAR(MAX)
   ,dataSources VARCHAR(MAX)
   ,fechaRegistro DATETIME NOT NULL
)