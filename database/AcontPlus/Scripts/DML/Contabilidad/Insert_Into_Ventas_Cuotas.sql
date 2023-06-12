use [Acontplus]
go

declare @table as table (
	idCuentaPorCobrar int 
   ,idEstadoPago int 
   ,nroCuota int 
   ,fechaVencimiento date
   ,cuota numeric(18,5)
   ,diasMora int
   ,mora numeric(18,5)
   ,abono numeric(18,5)
   ,entrada bit
   ,estado bit
)



INSERT INTO @table (idCuentaPorCobrar,idEstadoPago,nroCuota,fechaVencimiento,cuota,diasMora,mora,abono,entrada,estado)

SELECT  
		idCuentaPorCobrar = case td.codigo when 'fv' then (select cp.idCuentaPorCobrar from Contabilidad.CuentaPorCobrar cp where cp.codDoc = '01'and cp.idDocumento = cc.idComprobante)
							              when 'ne' then (select cp.idCuentaPorCobrar from Contabilidad.CuentaPorCobrar cp where cp.codDoc = 'NE'and cp.idDocumento = cc.idComprobante)
							end
,idEstadoPago,nroCuota,fechaVencimiento,cuota,diasMora,mora,abono,entrada,CC.estado
FROM DBO.CuotaXCobrar cc
inner join TipoDocumento td on td.idTipoDocumento = cc.idTipoDocumento

order by idComprobante,cc.idTipoDocumento

INSERT INTO Contabilidad.CuotaPorCobrar(idCuentaPorCobrar,idEstadoPago,nroCuota,fechaVencimiento,cuota,diasMora,mora,abono,entrada,estado)
SELECT idCuentaPorCobrar,idEstadoPago,nroCuota,fechaVencimiento,cuota,diasMora,mora,abono,entrada,estado from  @table where idCuentaPorCobrar is not null

