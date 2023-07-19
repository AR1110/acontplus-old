USE [AcontPlus]
go 

CREATE TABLE Contabilidad.Historial_Pago
(
	idHistorialPago INT IDENTITY(1,1) NOT NULL
   ,token VARCHAR(150) DEFAULT NEWID() NOT NULL
   ,idComprobanteEgreso BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.ComprobanteEgreso(idComprobanteEgreso) 
   ,idCuentaPorPagar INT NOT NULL FOREIGN KEY REFERENCES Contabilidad.CuentaPorPagar(idCuentaPorPagar)
   ,abono NUMERIC(18,5) NOT NULL
)