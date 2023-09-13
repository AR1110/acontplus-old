use [Acontplus]
go 

SELECT  sf.idFamilia
	   ,(select top 1 idFamilia 
	     from Familia f 
		 inner join sri.ActividadEconomica ae on ae.idActividadEconomica = f.ActividadEconomicaId
		 inner join sri.Establecimiento es on es.actividad = ae.codigo
		 where es.ruc = e.ruc)
FROM SubFamilia sf
inner join Entidad e on e.idEntidad = sf.idEntidad


update sf set
	sf.idFamilia = (select top 1 idFamilia 
	     from Familia f 
		 inner join sri.ActividadEconomica ae on ae.idActividadEconomica = f.ActividadEconomicaId
		 inner join sri.Establecimiento es on es.actividad = ae.codigo
		 where es.ruc = e.ruc)
FROM SubFamilia sf
inner join Entidad e on e.idEntidad = sf.idEntidad
