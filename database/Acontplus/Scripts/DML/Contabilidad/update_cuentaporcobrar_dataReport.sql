use [AcontPlus]
go 



DECLARE @table as table (
	idCuentaCorCobrar INT UNIQUE NOT NULL
   ,secuencial INT NOT NULL
   ,fechaRegistro DATETIME NOT NULL
   ,observacion VARCHAR(300) NULL
)

insert into @table (idCuentaCorCobrar,secuencial,fechaRegistro,observacion)
SELECT cc.idCuentaPorCobrar
	   ,secuencial = case when cc.codDoc = '01' THEN (SELECT f.nroFactura FROM dbo.Factura f with (nolock) where f.idfactura = cc.idDocumento) 
	                      when cc.codDoc = 'NE' THEN (SELECT n.nroDocumento FROM dbo.NotaEntrega n with (nolock) where n.idNotaEntrega = cc.idDocumento) 
					 END 
	   ,fechaRegistro = case when cc.codDoc = '01' THEN (SELECT f.fechaRegistro FROM dbo.Factura f with (nolock) where f.idfactura = cc.idDocumento) 
	                         when cc.codDoc = 'NE' THEN (SELECT n.fechaRegistro FROM dbo.NotaEntrega n with (nolock) where n.idNotaEntrega = cc.idDocumento) 
						   END
	   ,observacion =  case when cc.codDoc = '01' THEN (SELECT f.observacion FROM dbo.Factura f with (nolock) where f.idfactura = cc.idDocumento) 
	                         when cc.codDoc = 'NE' THEN (SELECT n.observacion FROM dbo.NotaEntrega n with (nolock) where n.idNotaEntrega = cc.idDocumento) 
						   END
FROM Contabilidad.CuentaPorCobrar cc


update cc set 
	cc.secuencial = t.secuencial
   ,cc.fechaRegistro = t.fechaRegistro
   ,cc.observacion = t.observacion
from Contabilidad.CuentaPorCobrar cc
inner join @table t ON t.idCuentaCorCobrar = cc.idCuentaPorCobrar

