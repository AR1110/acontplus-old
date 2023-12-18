use [AcontPlus]
go 



DECLARE @table AS TABLE 
(
	 idEstablecimiento INT NOT NULL
	,idProveedor INT NULL
	,idEstadoPago INT NOT NULL
	,codDoc VARCHAR(5) NOT NULL
	,uniqueId VARCHAR(49) NOT NULL
	,serieComprobante VARCHAR(20) NOT NULL
	,identificacion VARCHAR(20) NOT NULL
	,fechaEmision DATE NOT NULL
	,importeTotal NUMERIC(18,5)
	,idEntidad INT NOT NULL
	,idUsuario INT NOT NULL
)

INSERT INTO @table
       (idEstablecimiento
	   ,idProveedor
	   ,idEstadoPago
	   ,codDoc
	   ,uniqueId
	   ,serieComprobante
	   ,identificacion
	   ,fechaEmision
	   ,importeTotal
	   ,idEntidad
	   ,idUsuario)
select  dr.idEstablecimiento
       ,idProveedor =(SELECT idProveedor FROM dbo.Proveedor pr WITH (NOLOCK) WHERE pr.numeroIdentificacion = dr.rucEmisor AND pr.idEntidad = et.idEntidad)
	   ,idEstadoPago = (SELECT ep.idEstadoPago FROM dbo.EstadoPago ep where ep.codigo = 'PE')
	   ,dr.codDoc
	   ,claveAcceso
	   ,serieComprobante
	   ,rucEmisor
	   ,fechaEmision = CONVERT (date, fechaEmision, 103) 
	   ,importeTotal
	   ,et.idEntidad
	   ,dr.idUsuario
from recepcion.DocumentoRecibido dr
inner join dbo.Entidad et ON et.ruc = dr.identificacionReceptor 
where dr.codDoc = '01'

INSERT INTO Contabilidad.CuentaPorPagar
      (idEstablecimiento,idProveedor,idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
select idEstablecimiento,idProveedor,idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario 
from @table where idProveedor is not null

