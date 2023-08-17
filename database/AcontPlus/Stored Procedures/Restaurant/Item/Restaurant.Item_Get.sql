USE AcontPlus
GO
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14 
-- Description:	Get Item
-- =============================================
-- Restaurant.Item_Get 139, '{"checkSubFamilia":true,"idSubFamilia":1,"pageIndex":1,"pageSize":10, "tipo": 1}', ''
IF OBJECT_ID(N'Restaurant.Item_Get', N'P') IS NOT NULL
	DROP PROCEDURE Restaurant.Item_Get
GO
CREATE PROCEDURE Restaurant.Item_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @pageIndex INT
	DECLARE @pageSize INT	
	DECLARE @idSubFamilia INT
	DECLARE @checkSubFamilia BIT
	DECLARE @sql NVARCHAR(MAX)
	DECLARE @idEntidad INT
	DECLARE @params NVARCHAR(MAX)
    DECLARE @tipo INT

			
	SELECT @checkSubFamilia	= checkSubFamilia
			,@idSubFamilia  = idSubFamilia
			,@pageIndex		= pageIndex
			,@pageSize		= pageSize
            ,@tipo          = tipo
	FROM OPENJSON(@json) 
	WITH(
        tipo                INT '$.tipo'
		,checkSubFamilia	BIT '$.checkSubFamilia'
		,idSubFamilia	    INT '$.idSubFamilia'
		,pageIndex		    INT '$.pageIndex'
		,pageSize		    INT '$.pageSize'        
	)

	SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SET @params = '@idEntidad INT
				   ,@idSubFamilia INT
				   ,@pageIndex INT
				   ,@pageSize INT'

	SET @sql = 'SELECT 
				Id					= ri.Id
				,summary			= ISNULL(ri.Summary, ''_'')
				,cooking			= ri.Cooking
				,recipe				= ri.Recipe
				,instructions		= ISNULL(ri.Instructions, ''_'')
                ,content            = ISNULL(ri.content, ''_'')
				,createdAt			= ri.CreatedAt
				,updatedAt			= ri.UpdatedAt
				,enabled			= ri.Enabled
				,deleted			= ri.Deleted
				,userId				= ri.UserId
				,productId			= ri.ProductId
				,descripcion		= a.descripcion
				,s3ObjectUrl		= a.s3ObjectUrl
				,stockMinimo		= a.stockMinimo
				,stock				= a.stock
				,codigo				= a.codigo
				,codigoAuxiliar		= a.codigoAuxiliar
				,tipoIva			= CAST(CAST(a.porcentaje AS DECIMAL(15,0)) AS VARCHAR)+''%''
				,tipoArticulo		= ISNULL(a.tipoArticulo,''Ninguna'')
				,style				= a.colorRow 
				,ProductionAreaId   = pa.Id
				,descripcionProductionArea    = pa.Description
				,totalRecords		= COUNT(*) OVER()
				FROM Restaurant.Item ri
				INNER JOIN v_Articulo a ON a.idArticulo = ri.ProductId
				LEFT JOIN Restaurant.ProductionArea pa ON pa.Id = ri.ProductionAreaId
				WHERE a.idEntidad = @idEntidad ' 

    IF @tipo = 1
        BEGIN
            IF @checkSubFamilia = 1
		        BEGIN			
			        SET @sql = @sql + ' AND a.idSubFamilia = @idSubFamilia '
		        END

	        SET @sql = @sql + ' ORDER BY ri.CreatedAt DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
		
	        SET @tableNames = 'items'
	        EXEC sp_executesql @sql 
						        ,@params
						        ,@idEntidad		= @idEntidad
						        ,@idSubFamilia	= @idSubFamilia
						        ,@pageIndex		= @pageIndex
						        ,@pageSize		= @pageSize
        END

    IF @tipo = 2
        BEGIN
            SET @tableNames = 'ingredientType'
            SELECT * FROM Restaurant.IngredientType
        END	
END
GO