--use [Acontplus]
--go 

--INSERT INTO familia(ActividadEconomicaId,descripcion,siglas,fechaRegistro)
--select idActividadEconomica,descripcion,codigo,GETDATE() from Sri.ActividadEconomica 

select * from Familia where ActividadEconomicaId is not null 

