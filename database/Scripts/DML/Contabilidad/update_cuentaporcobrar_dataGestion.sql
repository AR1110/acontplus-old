use [AcontPlus]
go 

declare @table as table (
	idCuotaPorPagar INT UNIQUE NOT NULL
   ,fechaRegistro DATETIME  NULL
)

insert into @table (idCuotaPorPagar,fechaRegistro)
select cp.idCuentaPorPagar
	  ,fechaRegistro = case cp.codDoc WHEN '01' THEN (select dr.fechaRegistro from Recepcion.DocumentoRecibido dr with (nolock) where dr.claveAcceso =  cp.uniqueId)
						            WHEN 'FC' THEN (select fc.fechaRegistro from dbo.FacturaCompra fc with (nolock) where fc.uniqueId =  cp.uniqueId)
									WHEN 'DH' THEN (select di.fechaRegistro from Compra.Documento_Ingreso di with (nolock) where di.uniqueId =  cp.uniqueId)
									WHEN '03' THEN (select lc.fechaRegistro from dbo.LiquidacionCompra lc with (nolock) where lc.uniqueId =  cp.uniqueId)
					 END 
from Contabilidad.CuentaPorPagar cp with (nolock)


update cp set 
	cp.fechaRegistro = t.fechaRegistro

from Contabilidad.CuentaPorPagar cp 
inner join @table t ON t.idCuotaPorPagar = cp.idCuentaPorPagar
where t.fechaRegistro is not null

select * from Contabilidad.CuentaPorPagar

update Contabilidad.CuentaPorpagar set fechaRegistro = GETDATE() where fechaRegistro is null