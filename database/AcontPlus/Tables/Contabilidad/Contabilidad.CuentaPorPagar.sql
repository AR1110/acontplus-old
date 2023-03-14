use [AcontPlus]
go 


CREATE TABLE Contabilidad.CuentaPorPagar
(
	 idCuentaPorPagar INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idEstablecimiento INT FOREIGN KEY REFERENCES Sri.Establecimiento(idEstablecimiento)NOT NULL
	,idTiempoCredito INT FOREIGN KEY REFERENCES dbo.TiempoCredito(idTiempoCredito)NULL
	,idProveedor INT FOREIGN KEY REFERENCES dbo.Proveedor(idProveedor) NULL
	,idEstadoPago INT FOREIGN KEY REFERENCES dbo.EstadoPago(idEstadoPago) NOT NULL
	,codDoc VARCHAR(5) NOT NULL 
	,uniqueId VARCHAR(50) UNIQUE NOT NULL
	,serieComprobante VARCHAR(20) NOT NULL
	,identificacion VARCHAR(20) NOT NULL
	,fechaEmision DATETIME NOT NULL
	,fechaVencimiento DATETIME NULL
	,importeTotal NUMERIC(18,5) NOT NULL
	,abono NUMERIC(18,5) NULL
	,saldo AS CAST(importeTotal - abono AS NUMERIC(18,5)) 
	,idEntidad INT NOT NULL
	,idUsuario INT NOT NULL
)

