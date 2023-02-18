use [AcontPlus]
go 

--insert into TipoIva (descripcion,porcentaje,codigoPorcentaje,idImpuesto,fechaRegistro,codigo)
--select 'IVA 8%',8,8,1,GETDATE(),8

--insert into Sri.TarifaImpuesto (codImpuesto,codigo,descripcion,porcentaje,estado)
--select '2','8','8%',8,1

--update Sri.ActividadEconomica set codTarifaImpuesto = '8', porcentaje = 8 where codigo = '01'

select * from Sri.ActividadEconomica where codigo = '01'

SELECT * FROM Sri.TarifaImpuesto where codigo = '8'

select * from TipoIva