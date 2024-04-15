use [Acontplus]
go 

--ALTER TABLE TipoIva ADD fechaInicio DATETIME2

--ALTER TABLE TipoIva ADD fechaExpiracion DATETIME2


--update TipoIva set fechaExpiracion = '2024-03-30 00:00:00.000', fechaInicio = '2019-03-30 00:00:00.000' where codigoPorcentaje = '2'

--update TipoIva set fechaInicio = '2019-03-30 00:00:00.000' where codigoPorcentaje 
--in (
-- '6'
--,'0'
--,'7'
--,'8'
--)

--update TipoIva set fechaInicio = '2024-04-01 00:00:00.000' where codigoPorcentaje 
--in (
-- '4'
--,'5'
--)

--ALTER TABLE TipoIva ALTER COLUMN fechaInicio DATETIME2 NOT NULL

select * from TipoIva
