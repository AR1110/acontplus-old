USE [Acontplus]
GO
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Inventario.Medida_Get @userRoleId INT ,@json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
    DECLARE @idEntidad INT

    DECLARE @tipo INT 

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Get
    IF @tipo = 1
        BEGIN 
            SET @tableNames='measures'

	        DECLARE @pageIndex INT ,@pageSize INT ,@totalRecords INT

            SET @totalRecords = (SELECT COUNT(*) FROM Medida WHERE idEntidad = @idEntidad)

            SELECT @pageIndex = pageIndex ,@pageSize = pageSize FROM OPENJSON(@json) WITH (pageIndex INT, pageSize INT, tipo INT)

	        SELECT idMedida
		          ,descripcion
		          ,estado
		          ,codigo
		          ,totalRecords = @totalRecords
	        FROM Medida  
	        WHERE idEntidad = @idEntidad
	        ORDER BY idMedida DESC
	        OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
            
            RETURN 
        END
	

END
