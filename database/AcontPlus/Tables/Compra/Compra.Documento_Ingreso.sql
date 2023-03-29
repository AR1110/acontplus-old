USE [AcontPlus]
GO

IF OBJECT_ID(N'Compra.Documento_Ingreso', N'U') IS NOT NULL
	DROP TABLE Compra.Documento_Ingreso
GO

CREATE TABLE Compra.Documento_Ingreso (
	 idDocumentoIngreso INT IDENTITY(1,1) NOT NULL PRIMARY KEY
	,uniqueId VARCHAR(150) UNIQUE NOT NULL
	,idEstablecimiento INT FOREIGN KEY REFERENCES Sri.Establecimiento(idEstablecimiento) NOT NULL
	,idPuntoEmision INT FOREIGN KEY REFERENCES dbo.PuntoEmision(idPuntoEmision) NOT NULL
	,idProveedor INT  FOREIGN KEY REFERENCES dbo.Proveedor(idProveedor) NOT NULL
	,codDoc VARCHAR(5) NOT NULL
	,estab VARCHAR(5) NOT NULL
	,ptoEmi VARCHAR(5) NOT NULL
	,fechaEmision DATETIME NOT NULL
	,secuencial INT NOT NULL
	,totalSinImpuestos DECIMAL(15,5) NOT NULL
	,importeTotal DECIMAL(15,5)	
	,estado BIT  DEFAULT 1 NOT NULL
	,fechaRegistro DATETIME NOT NULL
	,idUsuario INT NOT NULL
    ,idEntidad INT NOT NULL
)



IF OBJECT_ID(N'Compra.Documento_Ingreso_Detail', N'U') IS NOT NULL
	DROP TABLE Compra.Documento_Ingreso_Detail
GO
CREATE TABLE Compra.Documento_Ingreso_Detail(
	 idDocumentoIngresoDetail INT IDENTITY(1,1) NOT NULL PRIMARY KEY	 
	,idDocumentoIngreso INT FOREIGN KEY REFERENCES Compra.Documento_Ingreso(idDocumentoIngreso) NOT NULL
	,idArticulo INT FOREIGN KEY REFERENCES dbo.Articulo(idArticulo) NOT NULL
	,idMedida INT FOREIGN KEY REFERENCES dbo.Medida(idMedida) NOT NULL
	,idBodega INT FOREIGN KEY REFERENCES dbo.Bodega(idBodega) NOT NULL
	,codigoPrincipal VARCHAR(100) NOT NULL
	,codigoAuxiliar VARCHAR(100) NOT NULL
	,descripcion VARCHAR(500) NOT NULL
	,cantidad DECIMAL(15,5) NOT NULL
	,precioUnitario DECIMAL(15,5) NOT NULL
	,costoNeto DECIMAL(15,5) NOT NULL
	,descuento DECIMAL(15,5) NOT NULL
	,precioTotalSinImpuesto DECIMAL(15,5) NOT NULL
	,codigoPorcentaje VARCHAR(5) NOT NULL
	,estado BIT DEFAULT 1 NOT NULL 

)


IF OBJECT_ID(N'Compra.Documento_Ingreso_Taxes', N'U') IS NOT NULL
	DROP TABLE Compra.Documento_Ingreso_Taxes
GO
CREATE TABLE Compra.Documento_Ingreso_Taxes (
	 idDocumentoIngresoTaxes INT NOT NULL PRIMARY KEY IDENTITY(1,1)
	,idDocumentoIngreso INT FOREIGN KEY REFERENCES Compra.Documento_Ingreso(idDocumentoIngreso) NOT NULL
	,idArticulo INT FOREIGN KEY REFERENCES dbo.Articulo(idArticulo) NOT NULL
	,codigo VARCHAR(50) NOT NULL
	,codigoPorcentaje VARCHAR(5) NULL
	,tarifa NUMERIC(15,5) NULL
	,baseImponible NUMERIC(15,5) NULL
	,valor NUMERIC(15,5) NULL
	,estado BIT DEFAULT 1 NOT NULL
)
 