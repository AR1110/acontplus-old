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
-- Restaurant.Order_Get 25, '{"id":102,"tipo":2}', ''
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
    ,@tableId     INT
    ,@sql         NVARCHAR(MAX)
    ,@params      NVARCHAR(MAX) = N'@pageIndex INT, @pageSize INT, @startDate DATETIME2, @endDate DATETIME2, @customerCompanyId INT, @tableId INT, @userId INT,@finished BIT,@rucEmpresa VARCHAR(13) '
    ,@idEntidad INT 
    ,@userId INT
    ,@finished BIT
    ,@rucEmpresa VARCHAR(13)

    SET @sql = N'SELECT Id		    = o.Id	
	                    ,EstablecimientoId	= o.EstablecimientoId
                        ,sri_e.codEstab    
                        ,telefonoEstablecimiento = sri_e.telefono
                        ,nombreComercialEstab    = sri_e.nombreComercial
	                    ,PuntoEmisionId		= o.PuntoEmisionId
	                    ,AppTableId			= ISNULL(o.AppTableId, 0)
	                    ,TableId			= ISNULL(o.TableId, 0)
	                    ,[Sequence]			= o.[Sequence]
	                    ,Serie				= o.Serie
	                    ,CustomerCompanyId	= o.CustomerCompanyId
                        ,telefonoCliente    = ISNULL(c.telefono, '''')
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
                        ,nameFiscal 	    = CASE WHEN o.CustomerCompanyId = 0 THEN ''CONSUMIDOR FINAL'' ELSE c.nombreFiscal END
	                    ,userName           = u.nombreUsuario
                        ,totalRecords       = COUNT(*) OVER()
                        ,o.Divided
                        ,o.Finished
                        ,ISNULL(vt.roomDescription,'''') + '' - '' + CONVERT(VARCHAR, ISNULL(vt.[NumberTable],0)) + '' '' + ISNULL(vt.[Description], '''') tableName
                    FROM Restaurant.[Order] o WITH(NOLOCK)
                    INNER JOIN Sri.Establecimiento sri_e WITH(NOLOCK) ON sri_e.idEstablecimiento = o.establecimientoId 
                    LEFT JOIN Cliente c ON c.idCliente = o.CustomerCompanyId
                    LEFT JOIN Usuario u ON u.idUsuario = o.UserId
                    LEFT JOIN Restaurant.v_Table vt WITH(NOLOCK) ON o.tableId = vt.Id
                    WHERE sri_e.ruc = @rucEmpresa AND CAST(o.CreatedAt AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) AND o.Enabled = 1 '

            
    SELECT @tipo                 = tipo
            ,@id                = id
            ,@customerCompanyId = customerCompanyId
            ,@pageIndex         = pageIndex
            ,@pageSize          = pageSize
            ,@startDate         = startDate
            ,@endDate           = endDate
            ,@tableId           = tableId
            ,@userId            = userId
            ,@finished          = finished
    FROM OPENJSON(@json) 
    WITH ( tipo      INT         '$.tipo',
            id        INT         '$.id',
            customerCompanyId INT '$.customerCompanyId',
            startDate DATETIME2  '$.startDate',
            endDate DATETIME2     '$.endDate',
            pageIndex INT         '$.pageIndex',
            pageSize  INT         '$.pageSize',
            tableId     INT       '$.tableId',
            userId INT '$.userId',
            finished BIT
    )

    SELECT @idEntidad = idEntidad, @rucEmpresa = rucEmpresa FROM v_usuario WHERE idUsuarioRol = @userRoleId

    IF (@tipo = 1)
        BEGIN
            IF (@customerCompanyId > 0)
                BEGIN
                    SET @sql = @sql + ' AND o.CustomerCompanyId = @customerCompanyId '
                END
            IF (@tableId > 0)
                SET @sql = @sql + ' AND o.TableId = @tableId'

            IF (@userId > 0)
                SET @sql = @sql + ' AND o.userId = @userId'

            IF @finished = 1
                BEGIN
                 SET @sql = @sql + ' AND o.Finished = 1'
                 END
            ELSE 
                BEGIN 
                    SET @sql = @sql + ' AND o.Finished = 0'
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
                                ,@tableId
                                ,@userId
                                ,@finished
                                ,@rucEmpresa
        END
    
    --Editar Orden
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
                medidaId            INT NOT NULL,
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
                RemainingQuantity   NUMERIC(18,5) NULL,

                medidasFraccionado VARCHAR(MAX) NOT NULL,
                medidasPrincipal   VARCHAR(MAX) NOT NULL
            )

            SET @tableNames = 'order,orderItems'
            
            SELECT 
                customerName = CASE WHEN o.CustomerCompanyId = 0 THEN 'CONSUMIDOR FINAL' ELSE c.nombreFiscal END
                ,tableName = r.[description] + ' - ' + ISNULL(t.[Description], '') 
                ,numberTable = numberTable
                ,o.*
             FROM Restaurant.[Order] o WITH(NOLOCK)
             LEFT JOIN Cliente c WITH(NOLOCK) ON c.idCliente = o.CustomerCompanyId
             LEFT JOIN Restaurant.[Table] t WITH(NOLOCK) ON t.iD = o.TableId
             LEFT JOIN Restaurant.[v_room] r ON r.Id = t.RoomId
             WHERE o.Id = @id 
            
            --ARTICULO- ITEMS 
            INSERT INTO @tblOrderItems(uuid, id, orderId, itemId, taxId, taxPercentId, feeId,  idArticulo, medidaId, codigoArticulo, descripcion, s3ObjectUrl,
                                        llevaInventario, taxRateCode, priceWithVat, taxValue, quantity, cost, price, discount, total, obs, bodegaId, paid,
                                        itemTypeCode, remainingQuantity, medidasFraccionado, medidasPrincipal
                                        )
            SELECT  o_i.uuid, o_i.Id, o_i.orderId, o_i.itemId, o_i.taxId, o_i.taxPercentId, o_i.feeId, va.idArticulo, o_i.medidaId, va.codigo, 
                    va.descripcion, va.s3ObjectUrl, va.llevaInventario, taxRateCode = sti.codigo, priceWithVat = CAST((o_i.Price + o_i.TaxValue) as numeric(18,5)),
                    o_i.taxValue, o_i.quantity, o_i.cost, o_i.price, o_i.discount, o_i.total, o_i.obs, o_i.bodegaId, o_i.Paid, i_t.Code, o_i.RemainingQuantity,
                    
                    ISNULL(
                            (SELECT idMedida      = m.idMedida 
			                        ,descripcion  = m.descripcion
			                        ,tarifas      = (SELECT afs.idTarifa, afs.precioVenta, afs.precioConIva, 
                                                            tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, ta.predeterminada
								                     FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								                     INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								                     WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								                     ORDER BY ta.predeterminada DESC FOR JSON PATH
                                                     )
			                        ,orden = IIF(af.gestionVenta = 1,1,3)
                                    ,af.conversion
			                FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			                INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			                WHERE af.idArticulo = va.idArticulo AND af.estado = 1 FOR JSON PATH),'[]'
                            ) as medidasFraccionado
                            ,
                            (SELECT  m.idMedida
			                        ,m.descripcion
			                        ,tarifas = (SELECT ap.idTarifa, ap.precioVenta, ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, 
                                                        ta.predeterminada
								                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								                WHERE ap.idArticulo = a.idArticulo
								                ORDER BY ta.predeterminada DESC FOR JSON PATH)
			                          ,orden = 2
                                      ,1 as conversion
			                    FROM dbo.Articulo     a WITH (NOLOCK)
			                    INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			                    WHERE a.idArticulo = va.idArticulo AND a.estado = 1 FOR JSON PATH
                             ) as medidasPrincipal
                    

            FROM Restaurant.[OrderItem] o_i with(nolock)
            INNER JOIN Restaurant.Item it               ON it.Id = o_i.ItemId
            INNER JOIN Restaurant.ItemType i_t         ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = it.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1

            --MENÚ- ITEMS 
            INSERT INTO @tblOrderItems(uuid,  id, orderId, itemTypeId, menuId, taxId, taxPercentId, feeId,  idArticulo, medidaId, codigoArticulo, descripcion, s3ObjectUrl,
               llevaInventario, taxRateCode, priceWithVat, summary, taxValue, quantity, cost, price, discount, total, obs, bodegaId, paid, itemTypeCode, remainingQuantity,
               medidasFraccionado, medidasPrincipal
            )
            SELECT o_i.uuid, o_i.id, o_i.orderId, o_i.ItemTypeId, o_i.MenuId, o_i.taxId, o_i.taxPercentId, o_i.feeId, va.idArticulo, o_i.medidaId, va.codigo, va.descripcion,
                va.s3ObjectUrl, va.llevaInventario, taxRateCode = sti.codigo, priceWithVat = cast((o_i.Price + o_i.TaxValue) as numeric(18,5)),
                m.Summary, o_i.taxValue, o_i.quantity, o_i.cost, o_i.price, o_i.discount, o_i.total, o_i.obs, o_i.bodegaId, o_i.Paid, i_t.Code, o_i.RemainingQuantity,
                  ISNULL(
                            (SELECT idMedida      = m.idMedida 
			                        ,descripcion  = m.descripcion
			                        ,tarifas      = (SELECT afs.idTarifa, afs.precioVenta, afs.precioConIva, 
                                                            tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, ta.predeterminada
								                     FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								                     INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								                     WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								                     ORDER BY ta.predeterminada DESC FOR JSON PATH
                                                     )
			                        ,orden = IIF(af.gestionVenta = 1,1,3)
                                    ,af.conversion
			                FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			                INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			                WHERE af.idArticulo = va.idArticulo AND af.estado = 1 FOR JSON PATH),'[]'
                            ) as medidasFraccionado
                            ,
                            (SELECT  m.idMedida
			                        ,m.descripcion
			                        ,tarifas = (SELECT ap.idTarifa, ap.precioVenta, ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, 
                                                        ta.predeterminada
								                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								                WHERE ap.idArticulo = a.idArticulo
								                ORDER BY ta.predeterminada DESC FOR JSON PATH)
			                          ,orden = 2
                                      ,1 as conversion
			                    FROM dbo.Articulo     a WITH (NOLOCK)
			                    INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			                    WHERE a.idArticulo = va.idArticulo AND a.estado = 1 FOR JSON PATH
                             ) as medidasPrincipal
            FROM Restaurant.[OrderItem] o_i with(nolock)
            INNER JOIN Restaurant.ItemType i_t          ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Restaurant.Menu m            ON o_i.menuId = m.Id 
            INNER JOIN Inventario.v_Articulo va  ON va.idArticulo = m.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1


            SELECT * FROM @tblOrderItems
        END

    --Order Document [Nota Entrega, Factura Venta]
    IF (@tipo=3)
        BEGIN  
            SET @tableNames = 'orderDocuments'
          
            SELECT
                v_cpc.codEstab
                ,v_cpc.idCuentaPorCobrar 
                ,od.DocumentoId
                ,od.orderId
                ,docType = IIF(v_cpc.codDoc='01', 'FV', v_cpc.codDoc)
                ,serie = v_cpc.serieComprobante
                ,serieComprobante = v_cpc.serieComprobante
                ,createAt = FORMAT(v_cpc.fechaEmision, 'dd/MM/yyyy HH:mm')
                ,customerName = v_cpc.razonSocialComprador
                ,userName = v_cpc.usuario
                ,v_cpc.tiempoCredito
                ,v_cpc.importeTotal
                ,v_cpc.abono
                ,v_cpc.saldo
                ,v_cpc.estado
                ,telefono = ISNULL(v_cpc.telefono, '')
                ,v_cpc.telefonoEstablecimiento
                ,v_cpc.nombreComercial
                ,v_cpc.codEstado
            FROM Restaurant.OrderDocument od WITH(NOLOCK)
            INNER JOIN v_CuentaPorCobrar v_cpc WITH(NOLOCK) ON v_cpc.idDocumento = od.DocumentoId
            WHERE v_cpc.idEntidad = @idEntidad AND od.orderId = @id AND v_cpc.codDoc IN('01', 'NE') 
        END

    --Order Filters 
    IF (@tipo = 4)
        BEGIN
            SET @tableNames = 'tables,usuarios'
            SELECT Id, [NumberTable], [Description], [Floor], roomDescription FROM Restaurant.v_Table vt INNER JOIN Entidad e WITH(NOLOCK) ON vt.ruc = e.ruc where e.idEntidad = @idEntidad
            SELECT 
				u.idUsuario, 
				u.nombreUsuario, 
				u.nombreCompleto				 
			 FROM v_usuario u WITH(NOLOCK) 
			 WHERE u.idEntidad = @idEntidad AND u.estadoUsuario = 1
        END
END
GO