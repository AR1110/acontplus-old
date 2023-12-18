use [AcontPlus]
go 


CREATE TABLE ApiPrinter.Config_Document
(
	idConfig_Document INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,idImpresora INT NOT NULL FOREIGN KEY REFERENCES ApiPrinter.Impresora(idImpresora)ON DELETE CASCADE
   ,codDoc VARCHAR(5) NOT NULL
   ,copyPrint INT NOT NULL
   ,estado BIT NOT NULL
)
