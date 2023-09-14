use [Acontplus]
go 

--INSERT INTO familia(ActividadEconomicaId,descripcion,fechaRegistro)
--select idActividadEconomica,cast(descripcion as varchar(35)),GETDATE() from Sri.ActividadEconomica 

select * from Familia where ActividadEconomicaId is not null 

