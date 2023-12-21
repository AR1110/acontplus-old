USE AcontPlus
GO
INSERT INTO Recepcion.CompraHabitual(idProveedor, codEstab, ruc, idArticulo, codArticulo, fechaRegistro, idUsuario)
SELECT idProveedor, codEstab, ruc, idArticulo, codArticulo, fechaRegistro, idUsuario FROM FactElect.CompraHabitual
GO

--SELECT * FROM Recepcion.CompraHabitual