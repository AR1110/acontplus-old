--GO
--	INSERT INTO dbo.TipoArticulo(descripcion, estado, fechaRegistro, codigo)
--	VALUES('Ingredientes', 1, GETDATE(), 'ING')
--GO

--GO
--	UPDATE dbo.TipoArticulo SET codigo = 'SP' WHERE idTipoArticulo = 2
--	UPDATE dbo.TipoArticulo SET codigo = 'COM' WHERE idTipoArticulo = 3
--GO

---ALTER TABLE dbo.TipoArticulo  add codigo VARCHAR(15) NULL

---UPDATE dbo.Articulo SET idTipoArticulo = 2
---select * from Articulo where idArticulo in (77508,77507,77506,77505)