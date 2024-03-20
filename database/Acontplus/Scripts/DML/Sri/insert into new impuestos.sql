use [Acontplus]
go 

--Iva 13%

--INSERT INTO TipoIva (descripcion,porcentaje,codigoPorcentaje,idImpuesto,fechaRegistro,idUsuario,codigo)
--select 'Iva 13%',13,10,1,GETDATE(),1,13

--Iva 5%
--INSERT INTO TipoIva (descripcion,porcentaje,codigoPorcentaje,idImpuesto,fechaRegistro,idUsuario,codigo)
--select 'Iva 5%',5,5,1,GETDATE(),1,13

--Iva 14%
--INSERT INTO TipoIva (descripcion,porcentaje,codigoPorcentaje,idImpuesto,fechaRegistro,idUsuario,codigo)
--select 'Iva 14%',14,3,1,GETDATE(),1,3

--Iva 55%
--INSERT INTO TipoIva (descripcion,porcentaje,codigoPorcentaje,idImpuesto,fechaRegistro,idUsuario,codigo)
--select 'Iva 15%',15,4,1,GETDATE(),1,4



select * from dbo.TipoIva order by porcentaje