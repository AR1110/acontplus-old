SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-14
-- Description:	sp for get order restaurant
-- =============================================
-- Restaurant.Order_Get 139, '{"tipo":1,"pageIndex":1,"pageSize":25,"startDate":"2023-09-05T17:18:46.886Z","endDate":"2023-09-05T17:18:46.886Z","customerCompanyId":0}', ''
-- Restaurant.Order_Get 139, '{"tipo": 2, "id": 136}', ''
CREATE OR ALTER PROCEDURE Restaurant.Order_Get @userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON; 
    SET LANGUAGE SPANISH;
    DECLARE @tipo INT
    ,@id          INT
    ,@customerCompanyId INT
    ,@pageIndex   INT
    ,@pageSize    INT
    ,@startDate   DATETIME2
    ,@endDate     DATETIME2
    ,@sql         NVARCHAR(MAX)
    ,@params      NVARCHAR(MAX) = N'@pageIndex INT, @pageSize INT, @startDate DATETIME2, @endDate DATETIME2, @customerCompanyId INT '


    --SET @today = CAST((SELECT dbo.ufnGetDateEcuador()) AS DATETIME2)

      SET @sql = N'SELECT Id		    = o.Id	
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
	                        ,CreatedAt			= CONVERT(VARCHAR,FORMAT(o.CreatedAt, ''dd-MM-yyyy HH:mm''))
	                        ,UpdatedAt			= CONVERT(VARCHAR,FORMAT(o.UpdatedAt, ''dd-MM-yyyy HH:mm''))
	                        ,[Enabled]			= o.[Enabled]
	                        ,Deleted			= o.Deleted
	                        ,UserId				= o.UserId
	                        ,Uuid				= o.Uuid
                            ,DocumentoId		= ISNULL(od.DocumentoId,0)
                            ,codDoc				= ISNULL(td.codigo,'''')
                            ,nameFiscal 	    = CASE WHEN o.CustomerCompanyId = 0 THEN ''CONSUMIDOR FINAL'' ELSE c.nombreFiscal END
	                        ,userName           = u.nombreUsuario
                            ,totalRecords       = COUNT(*) OVER()
                        FROM Restaurant.[Order] o WITH(NOLOCK)
                        LEFT JOIN Restaurant.OrderDocument od WITH(NOLOCK) ON o.Id = od.OrderId
                        LEFT JOIN TipoDocumento td WITH(NOLOCK) ON od.TipoDocumentoId = td.idTipoDocumento
                        LEFT JOIN Cliente c ON c.idCliente = o.CustomerCompanyId
                        LEFT JOIN Usuario u ON u.idUsuario = o.UserId
                        WHERE CAST(o.CreatedAt AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '

            
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
                   startDate DATETIME2  '$.startDate',
                   endDate DATETIME2     '$.endDate',
                   pageIndex INT         '$.pageIndex',
                   pageSize  INT         '$.pageSize'
            )
        IF (@tipo = 1)
        BEGIN 
            print @startDate
                        print @endDate

            IF (@customerCompanyId > 0)
                BEGIN
                    SET @sql = @sql + ' AND o.CustomerCompanyId = @customerCompanyId '
                END

            SET @sql = @sql + ' ORDER BY o.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
                                 
            SET @tableNames = 'orders'

            EXEC sp_executesql @sql
                                ,@params
                                ,@pageIndex
                                ,@pageSize
                                ,@startDate
                                ,@endDate
                                ,@customerCompanyId
        END
    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'order,orderItems'
            
            SELECT 
                customerName = CASE WHEN o.CustomerCompanyId = 0 THEN 'CONSUMIDOR FINAL' ELSE c.nombreFiscal END
                ,tableName = t.[Description]
                ,numberTable = numberTable
                ,o.*
             FROM Restaurant.[Order] o WITH(NOLOCK)
             LEFT JOIN Cliente c WITH(NOLOCK) ON c.idCliente = o.CustomerCompanyId
             LEFT JOIN Restaurant.[Table] t WITH(NOLOCK) ON t.iD = o.TableId
             WHERE o.Id = @id 
            
            SELECT i.*, va.idArticulo, va.descripcion, va.codigo, va.s3ObjectUrl, va.llevaInventario
            FROM Restaurant.[OrderItem] i WITH(NOLOCK)
            INNER JOIN Restaurant.Item it ON it.Id = i.ItemId
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = it.ProductId
            WHERE i.OrderId = @id AND ISNULL(i.Enabled, 0) = 1
        END
END
GO
