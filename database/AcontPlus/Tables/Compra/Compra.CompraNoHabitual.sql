

IF OBJECT_ID(N'Compra.CompraNoHabitual', N'U') IS NOT NULL
	DROP TABLE Compra.CompraNoHabitual
GO

CREATE TABLE Compra.CompraNoHabitual (
	idCompraNoHabitual INT IDENTITY(1,1) NOT NULL PRIMARY KEY
	,uniqueId VARCHAR(150) UNIQUE NOT NULL
	,idEntidad INT NOT NULL
	,idTiempoCredioto INT NOT NULL
	,idTipoDocumento INT NULL
	,idEstablecimiento INT NOT NULL
	,idPuntoEmision INT NOT NULL
	,idProveedor INT NOT NULL
	,estab VARCHAR(5) NOT NULL
	,ptoEmi VARCHAR(5) NOT NULL
	,fechaEmision DATETIME NOT NULL
	,fechaVencimiento DATETIME NOT NULL
	,secuencial INT NOT NULL
	,totalSinImpuestos DECIMAL(15,5)
	,importeTotal DECIMAL(15,5)	
	,estado bit 
	,fechaRegistro DATETIME NOT NULL
	,idUsuario INT NULL
)



IF OBJECT_ID(N'Compra.CompraNoHabitualDetalle', N'U') IS NOT NULL
	DROP TABLE Compra.CompraNoHabitualDetalle
GO
CREATE TABLE Compra.CompraNoHabitualDetalle(
	idCompraNoHabitualDetalle INT IDENTITY(1,1) NOT NULL PRIMARY KEY	 
	,uniqueId VARCHAR(150) 
	,idEntrada INT
	,idArticulo INT
	,idTarifa INT
	,idMedida INT
	,idBodega INT
	,codigoPrincipal VARCHAR(100)
	,codigoAuxiliar VARCHAR(100)
	,descripcion VARCHAR(500)
	,cantidad DECIMAL(15,5)
	,precioUnitario DECIMAL(15,5)
	,descuento DECIMAL(15,5)
	,precioTotalSinImpuesto DECIMAL(15,5)
	,codigo VARCHAR(5)
	,codigoPorcentaje VARCHAR(5)
	,tarifa DECIMAL(15,5)
	,baseImponible DECIMAL(15,5)
	,valor DECIMAL(15,5)
	,estado BIT DEFAULT 1 

)


IF OBJECT_ID(N'Compra.CompraNoHabitualImpuesto', N'U') IS NOT NULL
	DROP TABLE Compra.CompraNoHabitualImpuesto
GO
CREATE TABLE Compra.CompraNoHabitualImpuesto (
	idCompraNoHabitualImpuesto INT NOT NULL PRIMARY KEY IDENTITY(1,1)
	,idCompraNoHabitualDetalle INT NOT NULL
	,codigo VARCHAR(50) NOT NULL
	,codigoPorcentaje VARCHAR(5) NULL
	,tarifa NUMERIC(15,5) NULL
	,baseImponible NUMERIC(15,5) NULL
	,valor NUMERIC(15,5) NULL
)
 