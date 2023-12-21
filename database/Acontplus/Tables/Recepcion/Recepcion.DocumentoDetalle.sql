USE AcontPlus
GO
IF OBJECT_ID(N'Recepcion.DocumentoDetalle', N'U') IS NOT NULL
DROP TABLE Recepcion.DocumentoDetalle 
GO
CREATE TABLE Recepcion.DocumentoDetalle(
idDocumentoDetalle INT CONSTRAINT pk_rdrd NOT NULL PRIMARY KEY IDENTITY (1,1)
,idDocumento INT NOT NULL CONSTRAINT fk_rdr_det FOREIGN KEY (idDocumento) REFERENCES Recepcion.DocumentoRecibido(idDocumento)
,idBodega INT NOT NULL CONSTRAINT fk_rdr_det_b FOREIGN KEY (idBodega) REFERENCES Bodega(idBodega)
,idArticulo INT NOT NULL CONSTRAINT fk_rdr_det_a FOREIGN KEY (idArticulo) REFERENCES Articulo(idArticulo)
,idMedida INT NOT NULL CONSTRAINT fk_rdr_det_m FOREIGN KEY (idMedida) REFERENCES Medida(idMedida)
,codigoPrincipal VARCHAR(25) NOT NULL
,codigoAuxiliar VARCHAR(25) NULL
,descripcion VARCHAR(300) NOT NULL
,cantidad NUMERIC(18,2) NOT NULL
,precioUnitario NUMERIC(18,2) NOT NULL
,descuento NUMERIC(18,2) NOT NULL
,precioTotalSinImpuesto NUMERIC(18,2) NOT NULL
,detallesAdicionales XML NULL
,costoNeto NUMERIC (18,5) NOT NULL
,impuestos XML NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
)