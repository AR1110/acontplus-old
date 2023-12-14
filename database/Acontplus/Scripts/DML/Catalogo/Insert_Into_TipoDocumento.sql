use [AcontPlus]
go 

--insert into dbo.TipoDocumento (descripcion,codigo,fechaRegistro,secuencial) select 'Aprobación de Ventas','APR',GETDATE(),0

select * from dbo.TipoDocumento with (nolock) 
