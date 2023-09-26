USE Acontplus
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
-- Restaurant.Order_Get 139, '{"id":370,"tipo":2}', ''
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
                        ,Divided
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
            DECLARE @tblOrderItems AS TABLE(
                uuid     UNIQUEIDENTIFIER NOT NULL,
                id INT NOT NULL UNIQUE,
                orderId INT NOT NULL,
                itemTypeId INT NULL,
                menuId INT NULL,
                itemId INT NULL,
                taxId               INT NOT NULL,
                taxPercentId        INT NOT NULL,
                feeId               INT NOT NULL,
                idArticulo          INT NULL DEFAULT 0,
                codigoArticulo      VARCHAR(150) NOT NULL,
                descripcion         VARCHAR(300) NOT NULL,
                s3ObjectUrl         VARCHAR(300) NULL,
                llevaInventario     BIT DEFAULT 0,
                taxRateCode         VARCHAR(2),
                summary             VARCHAR(300) NULL,
                priceWithVat        NUMERIC (18,5) NOT NULL,
                taxValue            NUMERIC (18,5) NOT NULL,
                quantity            NUMERIC (18,5) NOT NULL,
                cost                NUMERIC(18,5) NOT NULL,
                price               NUMERIC(18,5) NOT NULL,
                discount            NUMERIC(18,5),
                total               NUMERIC(18,5) NOT NULL,
                obs                 VARCHAR(500) NULL,
                bodegaId            INT NOT NULL,                
                paid                bit NULL,
                itemTypeCode        VARCHAR(5) NOT NULL,
                RemainingQuantity   NUMERIC(18,5) NULL
            )

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
            
            --ARTICULO- ITEMS 
            INSERT INTO @tblOrderItems( 
                uuid, 
                id,
                orderId,
                itemId,
                taxId,                
                taxPercentId,
                feeId,  
                idArticulo,
                codigoArticulo,
                descripcion,
                s3ObjectUrl,
                llevaInventario,
                taxRateCode,
                priceWithVat,
                taxValue,
                quantity,
                cost,
                price,
                discount,
                total,
                obs,
                bodegaId, 
                paid,
                itemTypeCode,
                remainingQuantity
            )
            SELECT 
                o_i.uuid,
                o_i.Id,
                o_i.orderId,
                o_i.itemId,
                o_i.taxId,
                o_i.taxPercentId,
                o_i.feeId,
                va.idArticulo,
                va.codigo,
                va.descripcion,
                va.s3ObjectUrl,
                va.llevaInventario,
                taxRateCode = sti.codigo,
                priceWithVat = CAST((o_i.Price + o_i.TaxValue) as numeric(18,5)),
                o_i.taxValue,
                o_i.quantity,
                o_i.cost,
                o_i.price,
                o_i.discount,
                o_i.total,
                o_i.obs,
                o_i.bodegaId, 
                o_i.Paid,
                i_t.Code,
                o_i.RemainingQuantity                
            FROM Restaurant.[OrderItem] o_i with(nolock)
            INNER JOIN Restaurant.Item it ON it.Id = o_i.ItemId
            INNER JOIN Restaurant.ItemType i_t ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = it.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1

            --MENÚ- ITEMS 
            INSERT INTO @tblOrderItems(
                uuid,  
                id,
                orderId,
                itemTypeId,
                menuId,
                taxId,
                taxPercentId,
                feeId,  
                idArticulo,
                codigoArticulo,
                descripcion,
                s3ObjectUrl,
               llevaInventario,
                taxRateCode,
                priceWithVat,
                summary,
                taxValue,
                quantity,
                cost,
                price,
                discount,
                total,
                obs,
                bodegaId, 
                paid,
                itemTypeCode,
                remainingQuantity
            )
            SELECT 
                o_i.uuid, 
                o_i.id,
                o_i.orderId,
                o_i.ItemTypeId,
                o_i.MenuId,
                o_i.taxId,
                o_i.taxPercentId,
                o_i.feeId,
                va.idArticulo,
                va.codigo,
                va.descripcion,
                va.s3ObjectUrl,
                va.llevaInventario,
                taxRateCode = sti.codigo,
                priceWithVat = cast((o_i.Price + o_i.TaxValue) as numeric(18,5)),
                m.Summary,
                o_i.taxValue,
                o_i.quantity,
                o_i.cost,
                o_i.price,
                o_i.discount,
                o_i.total,
                o_i.obs,
                o_i.bodegaId, 
                o_i.Paid,
                i_t.Code,
                o_i.RemainingQuantity
            FROM Restaurant.[OrderItem] o_i with(nolock)
            INNER JOIN Restaurant.ItemType i_t ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Restaurant.Menu m ON o_i.menuId = m.Id 
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = m.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1


            SELECT * FROM @tblOrderItems
        END
END
GO