use [Acontplus]
go 

USE AcontPlus
GO
IF OBJECT_ID(N'Contabilidad.Historial_Cobro', N'U') IS NOT NULL
DROP TABLE Contabilidad.Historial_Cobro 
GO

CREATE TABLE Contabilidad.Historial_Cobro(
	idHistorialCobro INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,token VARCHAR(100) DEFAULT NEWID() NOT NULL
   ,idComprobanteIngreso BIGINT FOREIGN KEY REFERENCES dbo.ComprobanteIngreso(idComprobanteIngreso) NOT NULL
   ,idCuentaPorCobrar INT FOREIGN KEY REFERENCES Contabilidad.CuentaPorCobrar(idCuentaPorCobrar) NOT NULL
   ,abono NUMERIC(18,5) NOT NULL
)