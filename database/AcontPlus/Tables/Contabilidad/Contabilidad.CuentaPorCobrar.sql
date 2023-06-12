USE AcontPlus
GO
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar', N'U') IS NOT NULL
DROP TABLE Contabilidad.CuentaPorCobrar 
GO
CREATE TABLE Contabilidad.CuentaPorCobrar(
	 idCuentaPorCobrar INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,idPuntoEmision INT NOT NULL CONSTRAINT fk_estad_cxc FOREIGN KEY (idPuntoEmision) REFERENCES dbo.PuntoEmision(idPuntoEmision) 
	,idTiempoCredito INT NOT NULL CONSTRAINT fk_tcredito_cxc FOREIGN KEY (idTiempoCredito) REFERENCES dbo.TiempoCredito(idTiempoCredito) 
	,idCliente INT NOT NULL CONSTRAINT fk_cliente_cxc FOREIGN KEY (idCliente) REFERENCES dbo.Cliente(idCliente)
	,idEstadoDocumento INT NOT NULL CONSTRAINT fk_estadoDoc_cxc FOREIGN KEY (idEstadoDocumento) REFERENCES dbo.EstadoPago(idEstadoPago)
	,codDoc VARCHAR(5) NOT NULL
	,idDocumento INT NOT NULL
	,uniqueId VARCHAR(50) NOT NULL UNIQUE
	,serieComprobante VARCHAR(25) NOT NULL
	,fechaEmision DATETIME NOT NULL
	,fechaVencimiento DATETIME NOT NULL
	,importeTotal NUMERIC(18,5) NOT NULL
	,abono NUMERIC(18,5) DEFAULT 0 NOT NULL
	,mora NUMERIC(18,5) DEFAULT 0 NOT NULL
	,diasMora INT DEFAULT 0 NOT NULL
	,saldo AS CAST((importeTotal + mora ) - abono AS NUMERIC(15,5))
	,idEntidad INT NOT NULL
	,idUsuario INT NULL
)