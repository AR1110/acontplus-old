use [Acontplus]
go 


--ALTER TABLE dbo.NotaEntrega add convertToDoc BIT NULL




--update NotaEntrega set convertToDoc = 1 where idNotaEntrega in 
--(	
--	select cc.idDocumento from Contabilidad.CuentaPorCobrar cc 
--	INNER JOIN EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--	where cc.codDoc = 'NE'
--	and ep.codigo = 'TRA'
--)

--UPDATE NotaEntrega SET convertToDoc = 0  where convertToDoc is null 

select top 100 * from NotaEntrega
where convertToDoc = 0

--ALTER TABLE dbo.NotaEntrega alter column convertToDoc BIT not NULL

--alter table dbo.NotaEntrega add default 0 for convertToDoc
