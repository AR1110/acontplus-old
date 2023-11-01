USE AcontPlus
GO
/****** Object:  StoredProcedure [dbo].[aspArticuloFraccionadoGet]    Script Date: 10/11/2022 10:00:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-12
-- Description:	SP para listar los datos del producto fracionable
-- =============================================
-- Inventario.Fraccionado_Get 25, '{"pageSize":50,"pageIndex":1,"maxSize":5,"totalRecords":0}'

CREATE OR ALTER PROCEDURE Inventario.Fraccionado_Get
	 @userRoleId int
	,@json VARCHAR(600)
    ,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @pageIndex int
	DECLARE @pageSize int 
	DECLARE @totalRecords int 

	DECLARE @idEntidad int
    DECLARE @tipo INT 
	
	
	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId

	SET @totalRecords = (SELECT COUNT(*) FROM dbo.ArticuloFraccionado WHERE idEntidad = @idEntidad)
    SELECT 
        @pageIndex = pageIndex
        ,@pageSize = pageSize
        ,@tipo = tipo 
    FROM OPENJSON(@json)
    WITH(
        pageIndex int
        ,pageSize int
        ,tipo int
    )

    IF @tipo =1 
        BEGIN 
            SET @tableNames = 'articulosFraccionados'
			
	        SELECT 
		         af.idArticuloFraccionado
		        ,af.conversion
		        ,af.precioCostoFraccionado
		        ,af.gestionVenta
		        ,af.estado
		        ,articulo = ar.descripcion
		        ,medida = me.descripcion
		        ,ar.codigo
		        ,totalRecords = @totalRecords
	        FROM ArticuloFraccionado af
	        INNER JOIN Medida me  ON me.idMedida = af.idMedida
	        INNER JOIN Articulo ar ON ar.idArticulo = af.idArticulo
	        INNER JOIN Medida med ON med.idMedida = ar.idMedida
	        WHERE af.idEntidad = @idEntidad
	        ORDER BY af.idArticuloFraccionado DESC
			        OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
              RETURN 
        END 
    IF @tipo = 2
        BEGIN 
            SELECT 1
        END 

END
