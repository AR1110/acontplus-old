use [Acontplus]
go 


--ALTER TABLE Ventas.Aprob_Document_Detailt ADD fechaEmision DATETIME2 

SELECT * FROM Ventas.Aprob_Document_Detailt order by idAprob_Document_Detailt desc

--ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN fechaEmision DATETIME2 NOT NULL

--UPDATE Ventas.Aprob_Document_Detailt SET fechaEmision = GETDATE()
