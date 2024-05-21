

USE AcontPlus;

IF OBJECT_ID('Inventario.Etiqueta_Get') IS NOT NULL
	DROP PROCEDURE Inventario.Etiqueta_Get 
GO

CREATE PROCEDURE Inventario.Etiqueta_Get @idUsuarioRol INT, @json VARCHAR(900)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT = (SELECT idEntidad FROM App.UsuarioRol where idUsuarioRol = @idUsuarioRol)
	SELECT * FROM Inventario.Etiqueta WHERE idEntidad  = @idEntidad

END 