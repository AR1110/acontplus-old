USE AcontPlus
GO
IF OBJECT_ID(N'Recepcion.Doc_Detalle_Impuesto', N'U') IS NOT NULL
DROP TABLE Recepcion.Doc_Detalle_Impuesto 
GO
CREATE TABLE Recepcion.Doc_Detalle_Impuesto(
idDoc_Det_Imp INT CONSTRAINT pk_rdrddi NOT NULL PRIMARY KEY IDENTITY (1,1)
,idDocumento INT NOT NULL CONSTRAINT fk_rdr_ddet_imp FOREIGN KEY (idDocumento) REFERENCES Recepcion.DocumentoRecibido(idDocumento)
,idDocumentoDetalle INT NULL CONSTRAINT fk_rdr_det_imp FOREIGN KEY (idDocumentoDetalle) REFERENCES Recepcion.DocumentoDetalle(idDocumentoDetalle)
,codigoPrincipal VARCHAR(25) NOT NULL
,codigo VARCHAR(1) NOT NULL
,codigoPorcentaje VARCHAR(4) NULL
,tarifa NUMERIC(4,2) NOT NULL
,baseImponible NUMERIC(18,2) NOT NULL
,valor NUMERIC(18,2) NOT NULL
)