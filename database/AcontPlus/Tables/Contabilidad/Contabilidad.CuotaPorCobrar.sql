USE [AcontPlus]
GO 

IF OBJECT_ID(N'Contabilidad.CuotaPorCobrar', N'U') IS NOT NULL
DROP TABLE Contabilidad.CuotaPorCobrar 
GO
CREATE TABLE Contabilidad.CuotaPorCobrar
(
	 idCuotaPorCobrar INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idCuentaPorCobrar INT FOREIGN KEY REFERENCES Contabilidad.CuentaPorCobrar(idCuentaPorCobrar) NOT NULL
	,idEstadoPago INT FOREIGN KEY REFERENCES dbo.EstadoPago(idEstadoPago) NOT NULL 
	,nroCuota INT NOT NULL
	,fechaVencimiento DATE NOT NULL
	,cuota NUMERIC(18,5) NOT NULL
	,diasMora NUMERIC(18,5) NOT NULL DEFAULT 0
	,mora NUMERIC(18,5) NOT NULL DEFAULT 0
	,abono NUMERIC(18,5) DEFAULT 0 NOT NULL
	,saldo AS CAST((cuota + mora) - abono AS NUMERIC(18,5))
	,entrada BIT NOT NULL
	,estado BIT DEFAULT 1 
)