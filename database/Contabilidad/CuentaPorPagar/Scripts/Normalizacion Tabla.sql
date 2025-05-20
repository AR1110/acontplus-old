use [Acontplus]
go 


--QUERY FOR SEARCH ALL COLUMNS IN SPS
--SELECT OBJECT_NAME(OBJECT_ID) NAME,
--definition
--FROM sys.sql_modules
--WHERE definition LIKE '%' + 'identificacion' + '%'
--ORDER BY NAME
GO

--ALTER TABLE Contabilidad.CuentaPorPagar DROP COLUMN identificacion

--select top 100 * from Contabilidad.CuentaPorPagar

--> Alexis Ramirez 3/11/2025

--ALTER TABLE Contabilidad.CuentaPorPagar DROP COLUMN idEntidad

select top 10 * from Contabilidad.CuentaPorPagar


