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
	DECLARE @pageIndex INT
	DECLARE @pageSize INT 
    DECLARE @textSearch VARCHAR(300)
    DECLARE @id INT
	DECLARE @idEntidad INT
    DECLARE @tipo INT 
    DECLARE @sql NVARCHAR(MAX)
    DECLARE @params NVARCHAR(MAX)
	
	
	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo int)

    --> Get
    IF @tipo = 1 
        BEGIN 
            
            SELECT @pageIndex  = pageIndex 
                  ,@pageSize   = pageSize 
                  ,@textSearch = REPLACE(textSearch,SPACE(1),'%') 
            FROM OPENJSON(@json) WITH
            (
                pageIndex  INT 
               ,pageSize   INT 
               ,textSearch VARCHAR(300)
            )

            SET @tableNames = 'articulosFraccionados'
			
            SET @sql = 'SELECT 
		                     af.idArticuloFraccionado
		                    ,af.conversion
		                    ,af.precioCostoFraccionado
		                    ,af.gestionVenta
		                    ,af.estado
		                    ,articulo = ar.descripcion
		                    ,medida = me.descripcion
		                    ,ar.codigo
		                    ,COUNT(*) OVER() as totalRecords
	                    FROM ArticuloFraccionado af WITH (NOLOCK)
	                    INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
	                    INNER JOIN Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
	                    INNER JOIN Medida       med WITH (NOLOCK) ON med.idMedida  = ar.idMedida
	                    WHERE af.idEntidad = @idEntidad '

            SET @params = '@idEntidad  INT
                          ,@pageIndex  INT
                          ,@pageSize   INT
                          ,@textSearch VARCHAR(300)'

            IF @textSearch IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ar.descripcion + '''' + ar.codigo LIKE ''%'' + @textSearch + ''%'' '
                END 

            SET @sql = @sql + 'ORDER BY af.idArticuloFraccionado DESC OFFSET @pageSize * (@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC SP_EXECUTESQL @sql,@params
                                   ,@idEntidad  = @idEntidad
                                   ,@pageIndex  = @pageIndex
                                   ,@pageSize   = @pageSize
                                   ,@textSearch = @textSearch
            
            RETURN 
        END 

    --> 
    IF @tipo = 2
        BEGIN
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)
             
            SET @tableNames = 'data,pvps'

            SELECT  
		        af.idArticuloFraccionado
		        ,af.idArticulo
		        ,af.idMedida
		        ,af.conversion
		        ,gestionVenta = ISNULL(af.gestionVenta, 0)
		        ,af.precioCostoFraccionado
		        ,a.descripcion
		        ,a.precioCosto
		        ,a.codigo
		        ,nombreMedida = m.descripcion
	        FROM ArticuloFraccionado af
	        INNER JOIN Articulo a ON a.idArticulo = af.idArticulo
	        INNER JOIN Medida m ON m.idMedida = a.idMedida
	        WHERE af.idArticuloFraccionado = @id
		

	        SELECT 
		         afp.idArticuloFraccionadoPvP
		        ,afp.idTarifa
		        ,afp.precioVenta
		        ,afp.precioConIva
		        ,afp.porcentajeUtilidad
		        ,porcentajeIva = ti.porcentaje
		        ,UPPER(t.descripcion) AS tarifa
	        FROM ArticuloFraccionadoPvP afp
	        INNER JOIN ArticuloFraccionado af ON af.idArticuloFraccionado = afp.idArticuloFraccionado
	        INNER JOIN Tarifa t ON t.idTarifa = afp.idTarifa
	        INNER JOIN Articulo a ON a.idArticulo = af.idArticulo
	        INNER JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
	        WHERE afp.idArticuloFraccionado = @id
            RETURN 
        END 

END
