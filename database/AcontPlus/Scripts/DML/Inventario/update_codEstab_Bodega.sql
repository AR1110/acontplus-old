USE [AcontPlus]
GO 

UPDATE b SET 
	b.codEstab = S.codEstab
FROM Bodega b 
INNER JOIN Sucursal s ON s.idSucursal = b.idSucursal

SELECT * FROM DBO.Bodega