USE AcontPlus
GO
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar', N'U') IS NOT NULL
DROP TABLE Contabilidad.CuentaPorCobrar 
GO
CREATE TABLE Contabilidad.CuentaPorCobrar(
	 idCuentaPorCobrar INT IDENTITY(1,1) NOT NULL
	,idEstablecimiento INT NOT NULL CONSTRAINT fk_estad_cxc FOREIGN KEY (idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento) 
	,idTiempoCredito INT NOT NULL CONSTRAINT fk_tcredito_cxc FOREIGN KEY (idTiempoCredito) REFERENCES dbo.TiempoCredito(idTiempoCredito) 
	,idCliente INT NOT NULL CONSTRAINT fk_cliente_cxc FOREIGN KEY (idCliente) REFERENCES dbo.Cliente(idCliente)
	,codDoc VARCHAR(5) NOT NULL
	,uniqueId VARCHAR(50) NOT NULL UNIQUE
	,serieComprobante VARCHAR(25) NOT NULL UNIQUE
	,fechaEmision DATETIME NOT NULL
	,fechaVencimiento DATETIME NOT NULL
	,importeTotal NUMERIC(18,5) NOT NULL
	,abono NUMERIC(18,5) DEFAULT 0 NOT NULL
	,saldo AS importeTotal - abono
	,idEntidad INT NOT NULL
	,idUsuario INT NULL
)