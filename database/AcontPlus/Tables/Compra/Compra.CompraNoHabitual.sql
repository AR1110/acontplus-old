USE [AcontPlus]
GO

IF OBJECT_ID('Compra.CompraNoHabitual', 'U') IS NOT NULL
	DROP TABLE Compra.CompraNoHabitual
GO

CREATE TABLE Compra.CompraNoHabitual (
	idCompraNoHabitual INT IDENTITY(1,1) NOT NULL PRIMARY KEY
	,uniqueId VARCHAR(150) UNIQUE NOT NULL
	,idEntidad INT NOT NULL
	,idTiempoCredioto INT NOT NULL
	,idTipoDocumento INT NOT NULL
	,idEstablecimiento INT NOT NULL
	,idPuntoEmision INT NOT NULL	
	,estab VARCHAR(5) NOT NULL
	,ptoEmi VARCHAR(5) NOT NULL
	,fechaEmision DATETIME NOT NULL
	,fechaVencimiento DATETIME NOT NULL
	,secuencial INT NOT NULL
	,totalSinImpuestos DECIMAL(15,5)
	,importeTotal DECIMAL(15,5)
	,abono DECIMAL(15,5)
	,saldo as CAST(importeTotal - abono AS DECIMAL(15,5))
	,estado bit 
)

CREATE TABLE Compra.CompraNoHabitualDetalle(
	idCompraNoHabitualDetalle INT IDENTITY(1,1) NOT NULL PRIMARY KEY
)


DECLARE @secuencial VARCHAR(MAX)

DECLARE @Entrada AS TABLE(
	 idEntrada INT 
	,uniqueId VARCHAR(150) UNIQUE --'C-2022-0000004'
	,idTiempoCredioto INT
	,idTipoDocumento INT
	,idEstablecimiento INT
	,idPuntoEmision INT
	,idCategoriaCompra INT
	,estab VARCHAR(5)
	,fechaEmision DATETIME 
	,fechaVencimiento DATETIME
	,ptoEmi VARCHAR(5)
	,secuencial INT
	,totalSinImpuestos DECIMAL(15,5)
	,importeTotal DECIMAL(15,5)
	,abono DECIMAL(15,5)
	,saldo as CAST(importeTotal - abono AS DECIMAL(15,5))
	,estado bit 
)

DECLARE @EntradaDetalle as table (
	 idEntradaDetalle INT
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