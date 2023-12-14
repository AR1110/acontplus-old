USE AcontPlus

---- Doc: Insert.
---- Sugerencia de Ing. Cristian.
---- Date: 09/07/2023

GO
INSERT INTO dbo.Marca(descripcion, estado, fechaRegistro, fechaBaja, idUsuario, idEntidad, codigo, importacion)
VALUES('NINGUNA', 1, GETDATE(), NULL, 159, 7, 'MA000000508', 0)
GO


GO
	INSERT INTO dbo.TipoIce(codigo,  descripcion, porcentaje, valor, estado, fechaRegistro, idUsuario, idActividadEmpresa)
	VALUES('0', 'NINGUNA', 0,0, 1, GETDATE(), NULL, 49)
GO

