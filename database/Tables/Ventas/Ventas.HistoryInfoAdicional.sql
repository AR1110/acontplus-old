
USE AcontPlus;

CREATE TABLE Ventas.HistoryInfoAdicional (
	 idHistoryInfoAdicional INT NOT NULL PRIMARY KEY IDENTITY(1,1)
	,idInfoAdicional INT NOT NULL CONSTRAINT FK_HistoryInfoAdicional_idInfoAdicional FOREIGN KEY (idInfoAdicional) REFERENCES Compra.InfoAdicional(idInfoAdicional) 
	,codDoc VARCHAR(5) NOT NULL --'ne','fe'
	,idDocumento INT NOT NULL
	,secuencial INT NOT NULL
	,ptoEmi varchar(5) NOT NULL
	,estab VARCHAR(5) NOT NULL
)

--select * from Ventas.HistoryInfoAdicional

--declare @table as table (
--	 id INT PRIMARY KEY 
--	,idInfoAdicional INT 
--	,codDoc VARCHAR(5) --'ne','fe'
--	,idDocumento INT 
--	,secuencial INT 
--	,ptoEmi varchar(5)
--	,estab VARCHAR(5)
--)

--SELECT * FROM InfoAdicionalDoc
SELECT * FROM Compra.InfoAdicional