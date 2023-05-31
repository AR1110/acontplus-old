use [Acontplus]
go 

USE AcontPlus
GO
IF OBJECT_ID(N'Contabilidad.Historial_Interes', N'U') IS NOT NULL
DROP TABLE Contabilidad.Historial_Interes 
GO

CREATE TABLE Contabilidad.Historial_Interes(
	
)