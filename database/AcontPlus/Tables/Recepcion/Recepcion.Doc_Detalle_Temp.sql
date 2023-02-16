USE AcontPlus
GO
IF OBJECT_ID(N'Recepcion.Doc_Detalle_Temp', N'U') IS NOT NULL
DROP TABLE Recepcion.Doc_Detalle_Temp 
GO
CREATE TABLE Recepcion.Doc_Detalle_Temp(
idDocumento INT NOT NULL
,idProveedor INT NULL
,idArticulo INT NULL
,idMedida INT NULL
,codigoPrincipal VARCHAR(100) NOT NULL
,codigoAuxiliar VARCHAR(100) NULL
,cantidad VARCHAR(100) NOT NULL
,descripcion VARCHAR(300) NOT NULL
,precioUnitario VARCHAR(15) NOT NULL
,descuento VARCHAR(15) NULL
,precioTotalSinImpuesto VARCHAR(15) NULL
,impuestos VARCHAR(MAX) NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
,isCustom BIT NOT NULL DEFAULT 0
)