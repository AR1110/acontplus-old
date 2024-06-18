use [Acontplus]
go 


--QUERY FOR SEARCH ALL COLUMNS IN SPS
SELECT OBJECT_NAME(OBJECT_ID) NAME,
definition
FROM sys.sql_modules
WHERE definition LIKE '%' + 'identificacion' + '%'
ORDER BY NAME
GO

--ALTER TABLE Contabilidad.CuentaPorPagar DROP COLUMN identificacion


SELECT * FROM 

--select top 100 * from Contabilidad.CuentaPorPagar