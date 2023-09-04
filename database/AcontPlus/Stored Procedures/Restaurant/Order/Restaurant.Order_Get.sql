SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-14
-- Description:	sp for get order restaurant
-- =============================================
-- Restaurant.Order_Get 139, '{"tipo": 1, "pageIndex": 1, "pageSize": 10, "startDate": "2023-09-01", "endDate": "2023-09-02", "customerCompanyId": 63914}', ''
-- Restaurant.Order_Get 139, '{"tipo": 2, "id": 136}', ''
CREATE OR ALTER PROCEDURE Restaurant.Order_Get @userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @tipo INT
    ,@id          INT
    ,@customerCompanyId INT
    ,@pageIndex   INT
    ,@pageSize    INT
    ,@startDate DATE
    ,@endDate    DATE
    ,@today       DATE
    ,@sql         NVARCHAR(MAX)
    ,@params      NVARCHAR(MAX)


    SET @today = CAST((SELECT dbo.ufnGetDateEcuador()) AS DATE)

    SELECT @tipo                 = tipo
            , @id                = id
            , @customerCompanyId = customerCompanyId
            , @pageIndex         = pageIndex
            , @pageSize          = pageSize
            , @startDate         = startDate
            , @endDate           = endDate
    FROM OPENJSON(@json) 
    WITH ( tipo      INT         '$.tipo',
           id        INT         '$.id',
           customerCompanyId INT '$.customerCompanyId',
           startDate DATE  '$.startDate',
           endDate DATE     '$.endDate',
           pageIndex INT         '$.pageIndex',
           pageSize  INT         '$.pageSize'
    )

    IF (@tipo = 1)
        BEGIN
            SET @params = N'@pageIndex INT,@pageSize INT,@startDate DATE,@endDate DATE,@today DATE,@customerCompanyId INT'

            SET @sql = N'   SELECT Id		    = o.Id	
	                        ,EstablecimientoId	= o.EstablecimientoId
	                        ,PuntoEmisionId		= o.PuntoEmisionId
	                        ,AppTableId			= ISNULL(o.AppTableId, 0)
	                        ,TableId			= ISNULL(o.TableId, 0)
	                        ,[Sequence]			= o.[Sequence]
	                        ,Serie				= o.Serie
	                        ,CustomerCompanyId	= o.CustomerCompanyId
	                        ,Tax				= o.Tax
	                        ,Discount			= o.Discount
	                        ,Tip				= o.Tip
	                        ,Total				= o.Total
	                        ,Obs				= o.Obs
	                        ,CreatedAt			= o.CreatedAt
	                        ,UpdatedAt			= o.UpdatedAt
	                        ,[Enabled]			= o.[Enabled]
	                        ,Deleted			= o.Deleted
	                        ,UserId				= o.UserId
	                        ,Uuid				= o.Uuid
                            ,DocumentoId		= ISNULL(od.DocumentoId,0)
                            ,codDoc				= ISNULL(td.codigo,'''')
                            ,totalRecords       = COUNT(*) OVER()
                        FROM Restaurant.[Order] o WITH(NOLOCK)
                        LEFT JOIN Restaurant.OrderDocument od WITH(NOLOCK) ON o.Id = od.OrderId
                        LEFT JOIN TipoDocumento td WITH(NOLOCK) ON od.TipoDocumentoId = td.idTipoDocumento
                        WHERE CAST(o.CreatedAt AS DATE) BETWEEN ISNULL(@startDate, @today) AND ISNULL(@endDate, @today) '

            IF @customerCompanyId IS NOT NULL
                BEGIN
                    SET @sql = @sql + ' AND o.CustomerCompanyId = @customerCompanyId '
                END

            PRINT @sql 

            SET @sql = @sql + ' ORDER BY o.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
                     
            
            SET @tableNames = 'orders'
            EXEC sp_executesql @sql
                                ,@params
                                ,@pageIndex
                                ,@pageSize
                                ,@startDate
                                ,@endDate
                                ,@today
                                ,@customerCompanyId
        END
    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'order,orderItems'
            SELECT o.* FROM Restaurant.[Order] o 
            WITH(NOLOCK) WHERE o.Id = @id 
            
            SELECT i.*, va.descripcion, va.codigo
            FROM Restaurant.[OrderItem] i WITH(NOLOCK)
            INNER JOIN Restaurant.Item it ON it.Id = i.ItemId
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = it.ProductId
            WHERE i.OrderId = @id AND ISNULL(i.Enabled, 0) = 1
        END
END
GO
