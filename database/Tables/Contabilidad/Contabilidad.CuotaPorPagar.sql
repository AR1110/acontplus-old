use [AcontPlus]
go

--DROP TABLE Contabilidad.CuotaPorPagar
--GO

CREATE TABLE Contabilidad.CuotaPorPagar
(
	 idCuotaPorPagar INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idCuentaPorPagar INT FOREIGN KEY REFERENCES Contabilidad.CuentaPorPagar(idCuentaPorPagar) NOT NULL
	,idEstadoPago INT FOREIGN KEY REFERENCES dbo.EstadoPago(idEstadoPago) NOT NULL 
	,nroCuota INT NOT NULL
	,fechaVencimiento DATETIME NOT NULL
	,cuota NUMERIC(18,5) NOT NULL
	,abono NUMERIC(18,5) DEFAULT 0 NOT NULL
	,saldo AS CAST(cuota - abono AS NUMERIC(18,5))
	,entrada BIT NULL
	,estado BIT DEFAULT 1 
	,idCuotaXPagar BIGINT  FOREIGN KEY REFERENCES dbo.CuotaXPagar(idCuotaXPagar) NOT NULL
)