USE [AcontPlus]
GO

CREATE TABLE Ventas.Aprob_Document
(
    idAprob_Document INT IDENTITY(1,1) NOT NULL PRIMARY KEY 
   ,uniqueId VARCHAR(150) UNIQUE NOT NULL
   ,idCliente INT NOT NULL
   ,idPuntoEmision INT NOT NULL
   ,idSucursal INT NOT NULL
   ,fechaEmision DATETIME NOT NULL
   ,identificacionComprador VARCHAR(20) NOT NULL
   ,codDoc VARCHAR(5) NOT NULL
   ,estab VARCHAR(5) NOT NULL
   ,ptoEmi VARCHAR(5) NOT NULL
   ,ruc VARCHAR(20) NOT NULL
   ,ambiente VARCHAR(5) NOT NULL
   ,tipoEmision VARCHAR(5) NOT NULL
   ,secuencial INT NOT NULL
   ,claveAcceso VARCHAR(50) UNIQUE NOT NULL
   ,totalSinImpuestos DECIMAL(20,5) NOT NULL
   ,totalDescuento DECIMAL(20,5) NOT NULL
   ,totalConImpuestos DECIMAL(20,5) NOT NULL
   ,propina DECIMAL(20,5) NOT NULL
   ,importeTotal DECIMAL(20,5) NOT NULL
   ,codigoPorcentaje INT NOT NULL
   ,docOrigen VARCHAR(10) NOT NULL
   ,codEstado VARCHAR(15) DEFAULT 'PE'
   ,observacion VARCHAR(300) NULL
   ,estado BIT DEFAULT 1 
   ,idEntidad INT NOT NULL
   ,idUsuario INT NOT NULL
   
)
GO



CREATE TABLE Ventas.Aprob_Document_Detailt
(
	 idAprob_Document_Detailt INT IDENTITY(1,1) NOT NULL PRIMARY KEY 
	,uniqueId VARCHAR(150) NOT NULL
	,codArticulo VARCHAR(20) NOT NULL
	,idTarifa INT NOT NULL
	,codMedida VARCHAR(20) NOT NULL
	,codigoPrincipal VARCHAR(100) NOT NULL
	,codigoAuxiliar VARCHAR(100) NOT NULL
	,descripcion VARCHAR(100) NOT NULL
	,cantidad DECIMAL(15,5) NOT NULL
	,precioUnitario DECIMAL(20,5) NOT NULL
	,descuento DECIMAL(20,5) NOT NULL
	,precioTotalSinImpuesto DECIMAL(20,5) NOT NULL
	,codigo INT NOT NULL
	,codigoPorcentaje INT NOT NULL
	,tarifa DECIMAL(15,5) NOT NULL
	,baseImponible DECIMAL(15,5) NOT NULL
    ,valor AS CAST((tarifa/100) * baseImponible AS DECIMAL(15,5))
	,estado BIT DEFAULT 1 NOT NULL
)
GO

CREATE TABLE Ventas.Aprob_Document_Hist
(
	 idAprob_Document_Hist INT IDENTITY(1,1) NOT NULL PRIMARY KEY 
	,uniqueId VARCHAR(150) NOT NULL
	,idDocumento INT NOT NULL 
	,codDocumento VARCHAR(15) NOT NULL
	,serie VARCHAR(25) NOT NULL
	,estado BIT DEFAULT 1 
)
GO


CREATE TABLE Ventas.Aprob_Document_Audit
(
	 idAprob_Document_Audit INT IDENTITY(1,1) NOT NULL PRIMARY KEY 
	,uniqueId VARCHAR(150) NOT NULL
	,idUsuario INT NOT NULL 
	,estab VARCHAR(5) NOT NULL
	,ptoEmi VARCHAR(5) NOT NULL
	,secuencial INT NOT NULL
	,idEntidad INT NOT NULL
	,fechaRegistro DATETIME NOT NULL
	,estado BIT DEFAULT 1 
)
GO

CREATE TABLE Ventas.Aprob_Document_Anul
(
	idAprob_Document_Anul INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,uniqueId VARCHAR(150) NOT NULL
   ,idUsuario INT NOT NULL 
   ,fechaRegistro DATETIME NOT NULL
   ,estado BIT DEFAULT 1 
)