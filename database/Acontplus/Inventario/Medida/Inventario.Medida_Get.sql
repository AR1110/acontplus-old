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
	DECLARE @pageIndex INT 
	DECLARE @pageSize INT 
	DECLARE @totalRecords INT 
    DECLARE @tipo INT 

	SELECT 
        @tipo = tipo,  
        @pageIndex = pageIndex, 
        @pageSize = pageSize 
    FROM OPENJSON(@json) 
    WITH (pageIndex INT, pageSize INT, tipo INT)

	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId

	SET @totalRecords = (SELECT COUNT(*) FROM Medida WHERE idEntidad = @idEntidad)

    IF @tipo = 1
        BEGIN 
            SET @tableNames='measures'
	        SELECT 
	             idMedida
		        ,descripcion
		        ,estado
		        ,codigo
		        ,totalRecords = @totalRecords
	        FROM Medida  
	        WHERE idEntidad = @idEntidad
	        ORDER BY idMedida DESC
	        OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY        
        END
	

END
