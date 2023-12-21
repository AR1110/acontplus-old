USE [AcontPlus]
GO 

DECLARE @tabl TABLE 
(
	codEstab VARCHAR(50) UNIQUE NOT NULL
   ,idSucursal INT UNIQUE NOT NULL
)

INSERT INTO @tabl (codEstab,idSucursal)
SELECT cobEstab= 'ESTAB-'+Helper.F_Auto_Sequential(ROW_NUMBER() OVER (ORDER BY idSucursal ASC)), idSucursal FROM dbo.Sucursal ORDER BY idSucursal ASC

UPDATE s SET
s.codEstab = t.codEstab
FROM Sucursal s 
INNER JOIN @tabl t ON t.idSucursal = s.idSucursal