

USE AcontPlus;

GO

CREATE OR ALTER PROCEDURE Inventario.Etiqueta_Get @userRoleId INT, @json VARCHAR(900), @tableNames VARCHAR(MAX) OUTPUT 
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT = (SELECT idEntidad FROM v_usuario where idUsuarioRol = @userRoleId)

    SET @tableNames = 'tags'
	SELECT * FROM Inventario.Etiqueta WHERE idEntidad  = @idEntidad ORDER BY idEtiqueta DESC

END 