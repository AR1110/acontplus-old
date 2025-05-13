use [Acontplus]
go 



insert into dbo.TipoDocumento (descripcion,idTipoTransaccion,codigo,fechaRegistro,codigoSri,secuencial )
select 'Nota de Débito',1,'ND',GETDATE(),'05',0

select descripcion,idTipoTransaccion,codigo,fechaRegistro,codigoSri,secuencial from dbo.TipoDocumento