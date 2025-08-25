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
CREATE OR ALTER PROCEDURE Restaurant.Order_Get @userRoleId INT ,@json NVARCHAR(MAX) ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Sql
    DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

    DECLARE @tipo               INT
           ,@id                 INT
           ,@customerCompanyId  INT
           ,@pageIndex          INT
           ,@pageSize           INT
           ,@startDate          DATETIME2
           ,@endDate            DATETIME2
           ,@tableId            INT
           ,@idEntidad          INT
           ,@userId             INT
           ,@finished           BIT
           ,@rucEmpresa         VARCHAR(13)
           ,@estabId            INT
           ,@deleted            BIT
           ,@isEnabled          BIT
           ,@typeSearchCustomer CHAR(5)
           ,@puntoEmisionId     INT
           ,@isSearchDate       BIT

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT @idEntidad = idEntidad, @rucEmpresa = rucEmpresa FROM v_usuario WHERE idUsuarioRol = @userRoleId

    --> Get
    IF @tipo = 1
        BEGIN
            SET @tableNames = 'orders'

            SELECT @customerCompanyId  = customerCompanyId
                  ,@pageIndex          = pageIndex
                  ,@pageSize           = pageSize
                  ,@startDate          = startDate
                  ,@endDate            = endDate
                  ,@tableId            = tableId
                  ,@userId             = userId
                  ,@finished           = finished
                  ,@estabId            = estabId
                  ,@deleted            = deleted
                  ,@isEnabled          = isEnabled
                  ,@typeSearchCustomer = typeSearchCustomer
                  ,@puntoEmisionId     = puntoEmisionId
                  ,@isSearchDate       = isSearchDate
            FROM OPENJSON(@json) WITH
            (
                 customerCompanyId  INT
                ,startDate          DATETIME2
                ,endDate            DATETIME2
                ,pageIndex          INT
                ,pageSize           INT
                ,tableId            INT
                ,userId             INT
                ,finished           BIT
                ,estabId            INT
                ,deleted            BIT
                ,isEnabled          BIT
                ,isSearchDate       BIT
                ,typeSearchCustomer CHAR(5)
                ,puntoEmisionId     INT
            )

            SET @params= N'@pageIndex         INT
                          ,@pageSize          INT
                          ,@startDate         DATETIME2
                          ,@endDate           DATETIME2
                          ,@customerCompanyId INT
                          ,@tableId           INT
                          ,@userId            INT
                          ,@finished          BIT
                          ,@estabId           INT
                          ,@deleted           BIT
                          ,@isEnabled         BIT
                          ,@puntoEmisionId    INT
                          ,@CompanyId         INT'

            SET @sql = N'SELECT ro.Id
                               ,es.codEstab
                               ,ro.Serie
                               ,ro.Total
                               ,ro.Obs
                               ,FORMAT(ro.CreatedAt, ''dd-MM-yyyy HH:mm'') as CreatedAt
                               ,ro.Divided
                               ,ro.Finished
                               ,ro.[Enabled]
                               ,ro.[Deleted]
                               ,us.nombreUsuario                           as UserName
                               ,ISNULL(cu.BusinessName,''CONSUMIDOR FINAL'')                  as nameFiscal
                               ,ISNULL(cu.IdCard, ''9999999999999'') as IdCard
                               ,ta.[Description]                           as tableName
                               ,COUNT(*) OVER()                            as totalRecords
                         FROM Restaurant.[Order]         ro WITH (NOLOCK)
                         LEFT JOIN dbo.Cliente          cl WITH (NOLOCK) ON cl.idCliente         = ro.CustomerCompanyId
                         INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = ro.PuntoEmisionId
                         INNER JOIN dbo.usuario          us WITH (NOLOCK) ON us.idUsuario         = ro.UserId
                          LEFT JOIN [Restaurant].[Table] ta WITH (NOLOCK) ON ta.Id                = ro.TableId
                         INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                         LEFT JOIN Customer.Customer    cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
                         WHERE es.idEntidad = @CompanyId '


            IF @puntoEmisionId > 0
                BEGIN
                    SET @sql = @sql + 'AND ro.PuntoEmisionId = @puntoEmisionId '
                END

            IF @isSearchDate = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(ro.CreatedAt AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '
                END

            IF @tableId > 0
                BEGIN
                    SET @sql = @sql + 'AND ro.TableId = @tableId '
                END

            IF @userId > 0
                BEGIN
                    SET @sql = @sql + 'AND ro.userId = @userId '
                END

            SET @sql = @sql + 'AND ro.Enabled = @isEnabled '

            IF @isEnabled = 1
                BEGIN
                    SET @sql = @sql + 'AND ro.Finished = @finished '
                END


            IF (@typeSearchCustomer = 'OR' AND @customerCompanyId > 0)
                BEGIN
                    SET @sql = @sql + 'AND ro.CustomerCompanyId = @customerCompanyId '
                END

            IF (@typeSearchCustomer = 'DOC' AND @customerCompanyId > 0)
                BEGIN
                    SET @sql = @sql + 'AND EXISTS (
                                                    SELECT 1
                                                    FROM Restaurant.OrderDocument od WITH(NOLOCK)
                                                    INNER JOIN v_CuentaPorCobrar v_cpc WITH(NOLOCK) ON v_cpc.idDocumento = od.DocumentoId
                                                    WHERE od.orderId = ro.Id AND v_cpc.idCliente = @customerCompanyId
                                                ) '
                END



            SET @sql = @sql + 'ORDER BY ro.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
                                ,@params
                                ,@pageIndex
                                ,@pageSize
                                ,@startDate
                                ,@endDate
                                ,@customerCompanyId
                                ,@tableId
                                ,@userId         = @userId
                                ,@estabId        = @estabId
                                ,@deleted        = @deleted
                                ,@isEnabled      = @isEnabled
                                ,@finished       = @finished
                                ,@puntoEmisionId = @puntoEmisionId
                                ,@CompanyId      = @idEntidad

            RETURN
        END

    --> Editar Orden
    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'order,orderItems'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            DECLARE @tblOrderItems AS TABLE(
                uuid     UNIQUEIDENTIFIER NOT NULL,
                id INT NOT NULL UNIQUE,
                orderId INT NOT NULL,
                itemTypeId INT NULL,
                menuId INT NULL,
                itemId INT NULL,
                taxId               INT NOT NULL,
                taxPercentId        INT NOT NULL,
                taxPercent          INT NOT NULL,
                feeId               INT NOT NULL,
                idArticulo          INT NULL DEFAULT 0,
                medidaId            INT NOT NULL,
                codigoArticulo      VARCHAR(150) NOT NULL,
                descripcion         VARCHAR(300) NOT NULL,
                s3ObjectUrl         VARCHAR(300) NULL,
                llevaInventario     BIT DEFAULT 0,
                taxRateCode         VARCHAR(5),
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
                medidasPrincipal   VARCHAR(MAX) NOT NULL,
                medida VARCHAR(100) NOT NULL
            )


            SELECT ISNULL(cu.BusinessName,'CONSUMIDOR FINAL')   as customerName
                  ,tableName = rm.[description] + ' - ' + ISNULL(ta.[Description], '')
                  ,numberTable = numberTable
                  ,tipoIdentificacionSri= ti.codigoSri
                 ,customerIdentifiacion = ISNULL(cu.idCard, '9999999999999')
                  ,ro.*
             FROM Restaurant.[Order]           ro WITH (NOLOCK)
             LEFT JOIN Cliente                cl WITH (NOLOCK) ON cl.idCliente            = ro.CustomerCompanyId
              LEFT JOIN Restaurant.[Table]     ta WITH (NOLOCK) ON ta.Id                   = ro.TableId
             LEFT JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = cl.CustomerId
        --     LEFT JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
             LEFT JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId

              LEFT JOIN Restaurant.Room        rm WITH (NOLOCK) ON rm.Id                   = ta.RoomId
             WHERE ro.Id = @id

            --ARTICULO- ITEMS
            INSERT INTO @tblOrderItems(uuid, id, orderId, itemId, taxId, taxPercentId, taxPercent, feeId,  idArticulo, medidaId, codigoArticulo, descripcion, s3ObjectUrl,
                                        llevaInventario, taxRateCode, priceWithVat, taxValue, quantity, cost, price, discount, total, obs, bodegaId, paid,
                                        itemTypeCode, remainingQuantity, medidasFraccionado, medidasPrincipal, medida
                                        )
            SELECT  o_i.uuid, o_i.Id, o_i.orderId, o_i.itemId, o_i.taxId, o_i.taxPercentId, sti.porcentaje, o_i.feeId, va.idArticulo, o_i.medidaId, va.codigo,
                    va.descripcion, va.s3ObjectUrl, va.llevaInventario, taxRateCode = sti.codigo, priceWithVat = CAST((o_i.Price * (sti.porcentaje/100)) + o_i.Price as numeric(18,5)),
                    o_i.taxValue, o_i.quantity, o_i.cost, o_i.price, o_i.discount, o_i.total, o_i.obs, o_i.bodegaId, o_i.Paid, i_t.Code, o_i.RemainingQuantity,

                    ISNULL(
                            (SELECT idMedida      = m.idMedida
			                        ,descripcion  = m.descripcion
			                        ,tarifas      = (SELECT afs.idTarifa
                                                            ,afs.precioVenta
                                                            ,afs.precioConIva
                                                            ,tarifa = UPPER(ta.descripcion)
                                                            ,ta.ventaPorMayor,
                                                            ta.predeterminada
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
                             ) as medidasPrincipal,
                             va.medida

            FROM Restaurant.[OrderItem] o_i WITH (NOLOCK)
            INNER JOIN Restaurant.Item it               ON it.Id = o_i.ItemId
            INNER JOIN Restaurant.ItemType i_t         ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = it.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1

            --MEN�- ITEMS
            INSERT INTO @tblOrderItems(uuid,  id, orderId, itemTypeId, menuId, taxId, taxPercentId, taxPercent, feeId,  idArticulo, medidaId, codigoArticulo, descripcion, s3ObjectUrl,
               llevaInventario, taxRateCode, priceWithVat, summary, taxValue, quantity, cost, price, discount, total, obs, bodegaId, paid, itemTypeCode, remainingQuantity,
               medidasFraccionado, medidasPrincipal, medida
            )
            SELECT o_i.uuid, o_i.id, o_i.orderId, o_i.ItemTypeId, o_i.MenuId, o_i.taxId, o_i.taxPercentId, sti.porcentaje, o_i.feeId, va.idArticulo, o_i.medidaId, va.codigo, va.descripcion,
                va.s3ObjectUrl, va.llevaInventario, taxRateCode = sti.codigo, priceWithVat =CAST((o_i.Price * (sti.porcentaje/100)) + o_i.Price as numeric(18,5)),
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
                             ) as medidasPrincipal,
                             va.medida
            FROM Restaurant.[OrderItem] o_i with(nolock)
            INNER JOIN Restaurant.ItemType i_t          ON i_t.Id = o_i.ItemTypeId
            INNER JOIN Restaurant.Menu m            ON o_i.menuId = m.Id
            INNER JOIN Inventario.v_Articulo va  ON va.idArticulo = m.ProductId
            INNER JOIN Sri.TarifaImpuesto sti ON o_i.taxPercentId = sti.idTarifaImpuesto
            WHERE o_i.OrderId = @id AND ISNULL(o_i.[Enabled], 0) = 1


            SELECT * FROM @tblOrderItems

            RETURN
        END

    --> Order Document [Nota Entrega, Factura Venta]
    IF @tipo = 3
        BEGIN

            SET @tableNames = 'orderDocuments'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT cc.codEstab
			      ,cc.idCuentaPorCobrar
				  ,od.DocumentoId
				  ,td.codigo                                   as docType
				  ,cc.serieComprobante                         as serie
				  ,cc.serieComprobante
				  ,FORMAT(cc.fechaEmision, 'dd/MM/yyyy HH:mm') as createAt
				  ,cc.razonSocialComprador					   as customerName
				  ,cc.nombreUsuario							   as userName
				  ,cc.tiempoCredito
				  ,cc.importeTotal
				  ,cc.abono
				  ,cc.saldo
				  ,cc.estado
				  ,ISNULL(cc.telefono, '')                     as telefono
			FROM Restaurant.OrderDocument  od WITH (NOLOCK)
			INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = od.TipoDocumentoId
			INNER JOIN v_CuentaPorCobrar   cc WITH (NOLOCK) ON cc.idDocumento       = od.DocumentoId AND cc.codDoc = IIF(td.codigo = 'FV','01','NE')
			WHERE od.OrderId = @id

            RETURN
        END

    --> Order Filters
    IF (@tipo = 4)
        BEGIN

            SET @tableNames = 'tables,usuarios'

            SELECT Id
                  ,[NumberTable]
                  ,[Description]
                  ,[Floor]
                  ,roomDescription
                  ,vt.FloorId
                  ,vt.RoomId
            FROM Restaurant.v_Table vt
            WHERE vt.idEntidad = @idEntidad

            SELECT u.idUsuario
				  ,u.nombreUsuario
				  ,u.nombreCompleto
			 FROM v_usuario u WITH(NOLOCK)
			 WHERE u.idEntidad = @idEntidad
               AND u.estadoUsuario = 1

            RETURN
        END

    --> Estadisticas
    IF @tipo = 5
        BEGIN
              SET @tableNames = 'order,docs,productsTop,documentCounts'

			DECLARE @tbTotalSummary AS TABLE(
				descripcion VARCHAR(100) NOT NULL
				,cantidad INT NOT NULL
			)

            DECLARE @anio INT

            SELECT @anio = anio ,@estabId = estabId FROM OPENJSON(@json) WITH (anio INT ,estabId INT)

            SELECT  'Orden'              as docNom
                    ,SUM(ro.Total)       as totalVendido
                    ,YEAR(ro.CreatedAt)  as anio
                    ,MONTH(ro.CreatedAt) as mes
            FROM Restaurant.[Order]     ro WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ro.PuntoEmisionId
            WHERE pe.idEstablecimiento = @estabId
              AND YEAR(ro.CreatedAt)   = @anio
            GROUP BY YEAR(ro.CreatedAt), MONTH(ro.CreatedAt)
            ORDER BY anio, mes


          SELECT
                CASE
                    WHEN v_cpc.codDoc = '01' THEN 'Factura'
                    WHEN v_cpc.codDoc = 'NE' THEN 'Nota Entrega'
                    ELSE 'Otro'
                END AS docNom,
                SUM(v_cpc.importeTotal) AS totalVendido,
                YEAR(od.CreatedAt) AS anio,
                MONTH(od.CreatedAt) AS mes
            FROM
                Restaurant.OrderDocument od WITH(NOLOCK)
            INNER JOIN
                v_CuentaPorCobrar v_cpc WITH(NOLOCK)
                ON v_cpc.idDocumento = od.DocumentoId
            WHERE
                v_cpc.idEstablecimiento = @estabId AND
                YEAR(od.CreatedAt) = @anio AND
                v_cpc.codDoc IN ('01', 'NE')
            GROUP BY
                v_cpc.codDoc, YEAR(od.CreatedAt), MONTH(od.CreatedAt)
            ORDER BY
                v_cpc.codDoc, YEAR(od.CreatedAt), MONTH(od.CreatedAt)

            SELECT
                top 5 ri.Id,
                ar.descripcion ,
                COUNT(roi.ItemId) as vecesVendido
            FROM Articulo ar
            INNER JOIN Restaurant.Item ri ON ri.ProductId = ar.idArticulo
            INNER JOIN Restaurant.OrderItem roi ON roi.ItemId = ri.Id
            INNER JOIN Restaurant.[Order] ro ON ro.Id = roi.OrderId
            WHERE ro.EstablecimientoId = @estabId AND   YEAR(ro.CreatedAt) = @anio
            group by ri.Id, ar.descripcion, roi.ItemId
            order by count(ri.Id) desc;



			INSERT INTO @tbTotalSummary (descripcion, cantidad)
			SELECT
				'Ordenes' AS descripcion,
				COUNT(*) AS cantidad  -- Contar el n�mero de �rdenes
			FROM
				Restaurant.[Order] ro
			WHERE
				ro.establecimientoId = @estabId
				AND YEAR(ro.CreatedAt) = @anio;

			INSERT INTO @tbTotalSummary (descripcion, cantidad)
			SELECT
               'Facturas' AS descripcion,
                COUNT(*) AS cantidad
            FROM
                Restaurant.OrderDocument od WITH(NOLOCK)
            INNER JOIN
                v_CuentaPorCobrar v_cpc WITH(NOLOCK)
                ON v_cpc.idDocumento = od.DocumentoId
            WHERE
                v_cpc.idEstablecimiento = @estabId AND
                YEAR(od.CreatedAt) = @anio AND
                v_cpc.codDoc =  '01'

			INSERT INTO @tbTotalSummary (descripcion, cantidad)
			SELECT
               'Notas de Entrega' AS descripcion,
                COUNT(*) AS cantidad
            FROM
                Restaurant.OrderDocument od WITH(NOLOCK)
            INNER JOIN
                v_CuentaPorCobrar v_cpc WITH(NOLOCK)
                ON v_cpc.idDocumento = od.DocumentoId
            WHERE
                v_cpc.idEstablecimiento = @estabId AND
                YEAR(od.CreatedAt) = @anio AND
                v_cpc.codDoc =  'NE'

			SELECT * FROM @tbTotalSummary
        END


END
GO
