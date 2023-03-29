use [Acontplus]
go

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
	,idArticulo INT
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
	,estado BIT DEFAULT 1 

)

DECLARE @cuotaXpagar  as table (
	 idCuotaXPagar INT
	,uniqueId VARCHAR(150)
	,idEntrada INT
	,fechaVencimiento DATETIME
	,nroCuota INT
	,cuuota DECIMAL (15,5)
	,estado VARCHAR(5)
)

--select * from Ventas.Aprob_Document_Detailt

--select top 1 * from Recepcion.DocumentoRecibido where codDoc  = '01' 

--select top 1 * from Recepcion.DocumentoDetalle where idDocumento = 1

--SELECT top 1 * FROM Ventas.Aprob_Document

SELECT idFacturaCompra
      ,'C'+CAST(DATEPART(YEAR,fechaRegistro) AS varchar)+Helper.F_Auto_Sequential(ROW_NUMBER() over (PARTITION BY DATEPART(YEAR,fechaRegistro) order by idFacturaCompra asc)) uniqueId 
FROM FacturaCompra

SELECT LEN('C2022000000001')