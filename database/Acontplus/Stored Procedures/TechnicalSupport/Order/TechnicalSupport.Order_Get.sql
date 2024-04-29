USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-10-18
-- Description:	SP for get orders
-- TechnicalSupport.Order_Get 401, '{"tipo": 5, "id": 11}', ''
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @companyId INT
    ,@id INT
    ,@orderStatusCode VARCHAR(2)
    ,@pageIndex INT
    ,@pageSize INT
    ,@tipo INT
    ,@rucEmpresa VARCHAR(13)

	SELECT @id = id
        ,@orderStatusCode = orderStatusCode
        ,@pageIndex = pageIndex
        ,@pageSize = pageSize
        ,@tipo = tipo
    FROM OPENJSON (@json) WITH 
    (
        id              INT '$.id', 
        tipo            INT         '$.tipo',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode',
        pageIndex       INT '$.pageIndex',
        pageSize        INT '$.pageSize'
    )
	
    SELECT TOP 1 @rucEmpresa = rucEmpresa,  @companyId = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId

	IF @tipo = 1
		BEGIN
			SET @tableNames = 'puntosEmision,bodegas,users'
			SELECT * FROM v_PtoEmi_Asign WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WHERE idUsuarioRol = @userRoleId 
            SELECT * FROM v_usuario WHERE idEntidad = @companyId AND estadoUsuario = 1
            IF (@id > 0)
                BEGIN
                    SET @tableNames = @tableNames + ',order,orderDetails'

                    SELECT  o.[Id]
                    ,[Uuid]
                    ,CONVERT(VARCHAR, FORMAT([FechaEmision], 'yyyy-MM-dd'), 106) FechaEmision
                    ,[EstablecimientoId]
                    ,[PuntoEmisionId]
                    ,[Sequence]
                    ,[Serie]
                    ,[CustomerCompanyId]
                    ,[Tax]
                    ,[Discount]
                    ,[Tip]
                    ,[Total]
                    ,[Obs]
                    ,[OrderStatusId] 
                    ,o.[Enabled]
                    ,o.[Deleted]
                    ,o.[UserId]
                    ,[Finished]
                    ,[TaxPercentId]
                    ,ISNULL([AssignedUserId], 0) AssignedUserId
                    ,cc.BusinessName
                    FROM TechnicalSupport.[Order] o WITH (NOLOCK)
                        INNER JOIN dbo.Cliente c WITH (NOLOCK) ON  o.CustomerCompanyId = c.idCliente
                        INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id
                    WHERE o.Id = @id

                    SELECT od.[Id], od.[Uuid], od.[OrderId], od.[DeviceId], od.[Obs], od.[CreatedAt], od.[UpdatedAt], 
                        od.[Enabled], od.[Deleted], od.[UserId], ISNULL(od.[AssignedUserId], 0) AssignedUserId
                        ,d.[Name] DeviceName
                        ,dc.SerialNumber DeviceSerie
                        ,dc.Warranty DeviceWarranty
                        ,dc.Id DeviceCustomerId
                    FROM TechnicalSupport.[OrderDetail] od WITH (NOLOCK)
                        INNER JOIN TechnicalSupport.[Order] o WITH (NOLOCK) ON od.OrderId = o.Id
                        INNER JOIN TechnicalSupport.Device d WITH (NOLOCK) ON od.DeviceId = d.Id
                        INNER JOIN TechnicalSupport.DeviceCustomer dc WITH (NOLOCK) ON d.Id = dc.DeviceId AND dc.CustomerCompanyId = o.CustomerCompanyId
                    WHERE od.OrderId = @id
                END
		END

    IF @tipo = 2
    BEGIN
        SET @tableNames = 'orders'
        
        SELECT tor.Id
            ,tor.Uuid 
            ,tor.Serie
            ,fechaEmision            = FORMAT(tor.fechaEmision, 'dd/MM/yyyy HH:mm')
            ,ISNULL(tor.Tax, 0.0)       AS Tax
            ,ISNULL(tor.Discount, 0.0)  AS Discount
            ,ISNULL(tor.Tip, 0.0)       AS Tip
            ,ISNULL(tor.Total, 0.0)     AS Total
            ,ISNULL(tor.Obs, '')        AS obs
            ,tor.Enabled
            ,tor.CustomerCompanyId
            ,c.nombreFiscal             AS razonSocialComprador
            ,e.codEstab
            ,totalRecords       = COUNT(*) OVER()
            ,ISNULL(tor.AssignedUserId, 0) AssignedUserId 
            ,userName = IIF(sc.Code = 'PA', sc.[Name], u.nombreUsuario) 
        FROM TechnicalSupport.[Order] tor WITH (NOLOCK)
        INNER JOIN Cliente c               WITH (NOLOCK)         ON c.idCliente = tor.CustomerCompanyId
        INNER JOIN TechnicalSupport.OrderStatus sc WITH (NOLOCK)  ON sc.Id = tor.OrderStatusId
        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON tor.EstablecimientoId = e.idEstablecimiento
        LEFT JOIN dbo.Usuario u WITH(NOLOCK) ON u.idUsuario = tor.AssignedUserId
        WHERE e.ruc = @rucEmpresa AND  sc.Code = @orderStatusCode 
            AND tor.Deleted IS NULL
        ORDER BY tor.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY   
        RETURN
    END
    
    IF @tipo = 4
        BEGIN
            SET @tableNames = 'order,orderDetails,orderMaintenances,feeds,estabs,bodegas,taxes,taxPercents,decimalsConfig'
        
            SELECT 
            
                tor.Id
                ,tor.FechaEmision
                ,tor.EstablecimientoId
                ,tor.PuntoEmisionId                
                ,tor.Uuid
                ,tor.[Sequence]
                ,tor.Serie
                ,ISNULL(tor.Tax, 0.0)       AS Tax
                ,ISNULL(tor.Discount, 0.0)  AS Discount
                ,ISNULL(tor.Tip, 0.0)       AS Tip
                ,ISNULL(tor.Total, 0.0)     AS Total
                ,ISNULL(tor.Obs, '')        AS obs
                ,tor.Enabled
                ,tor.CustomerCompanyId
                ,c.nombreFiscal RazonSocial
            FROM TechnicalSupport.[Order] tor
            INNER JOIN Cliente c                        ON c.idCliente = tor.CustomerCompanyId
            INNER JOIN TechnicalSupport.OrderStatus sc  ON sc.Id = tor.OrderStatusId
            WHERE tor.Id = @id

            SELECT o.Id OrderDetailId, d.Id DeviceId, d.[Name] DeviceName, o.Obs
            FROM TechnicalSupport.[OrderDetail] o WITH (NOLOCK) 
            INNER JOIN TechnicalSupport.Device d WITH (NOLOCK) ON o.DeviceId = d.Id
            WHERE OrderId = @id

            SELECT om.Id
                  ,om.ProductId
                  ,om.BodegaId
                  ,om.FeeId
                  ,om.MedidaId
                  ,om.Quantity
                  ,om.Price
                  ,taxPercentage = ti.porcentaje
                  ,om.Cost
                  ,om.TaxId
                  ,om.TaxPercentId
                  ,Discount = ISNULL(om.Discount, 0)
                  ,PercentageDiscount = 0
                  ,om.TaxValue 
                  ,om.Total  
                  ,ISNULL(om.Descripcion, '') descripcion
                  ,a.llevaInventario 
                  ,a.precioSinSubsidio
                  ,a.codigo      
                  ,om.[Enabled]         AS estado
                  ,orderDetailId =  od.Id
                  ,om.Obs
                  ,ISNULL
                  ((
                        SELECT af.idMedida
                              ,IIF(af.gestionVenta = 1,1,3) as orden
                              ,af.conversion
                              ,af.precioCostoFraccionado
                              ,ar.precioCosto
			                  ,me.descripcion               as descripcion
			                  ,(
                                    SELECT pv.idTarifa
                                          ,pv.precioVenta
                                          ,pv.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor
                                          ,ta.predeterminada
					                FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					                WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                              ) as tarifas
			            FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			            INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                        INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			            WHERE af.idArticulo = om.ProductId
                        FOR JSON PATH
                
                    ),'[]') as fraccionado

                   ,ISNULL
                    ((
                        SELECT sc.idMedida
                              ,2              as orden
                              ,1              as conversion
			                  ,sc.precioCosto as precioCostoFraccionado
                              ,sc.precioCosto
                              ,me.descripcion
			                  ,(
                                    SELECT ap.idTarifa
                                          ,ap.precioVenta
                                          ,ap.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor 
                                          ,ta.predeterminada
					                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					                WHERE ap.idArticulo = sc.idArticulo
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                               ) as tarifas
			            FROM dbo.Articulo     sc WITH (NOLOCK)
			            INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			            WHERE sc.idArticulo = om.ProductId
                        FOR JSON PATH

                    ),'[]') as principal

                    ,ISNULL((
                
                        SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = om.ProductId AND st.idBodega = om.BodegaId FOR JSON PATH
         
                     ) ,'[]') as consolidacion

            FROM TechnicalSupport.[OrderMaintenance] om    WITH (NOLOCK)
            INNER JOIN TechnicalSupport.[OrderDetail] od ON om.OrderDetailId = od.Id
            INNER JOIN dbo.Bodega bo            WITH (NOLOCK) ON bo.idBodega   = om.BodegaId
            INNER JOIN Inventario.v_Articulo a WITH (NOLOCK) ON a.idArticulo = om.ProductId
            INNER JOIN Sri.TarifaImpuesto ti WITH(NOLOCK) ON ti.idTarifaImpuesto = om.taxPercentId
            WHERE od.OrderId = @Id
            
            SELECT idTarifa
	              ,descripcion
	              ,predeterminada
	              ,codigo 
	        FROM dbo.Tarifa WITH (NOLOCK) 
	        WHERE idEntidad = @companyId AND estado = 1
                       
            SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idPuntoEmision
                    ,ptoEmi + '-' + estab as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idBodega
                    ,bodega
                    ,defaultEstab
                    ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC


            SELECT * FROM Sri.Impuesto WITH (NOLOCK) 

	        SELECT 
                ti.idTarifaImpuesto
                ,ti.codigo
                ,ti.codImpuesto
                ,i.idImpuesto
                ,ti.descripcion
                ,ti.porcentaje
                ,ti.estado 
                pe FROM Sri.TarifaImpuesto ti WITH (NOLOCK)
            INNER JOIN Sri.Impuesto i WITH(NOLOCK)  ON i.codigo = ti.codImpuesto 

            SELECT * FROM  Config.v_Sistema_Decimal WHERE idEntidad = @companyId AND codTrasaccion = 'V'
            RETURN
        END

    IF @tipo = 5
        BEGIN
            SET @tableNames = 'documento,documentoDetalle'

            ---- DATOS PRINCIPALES
            SELECT tsod.DocumentoId 
                ,   tsod.TipoDocumentoId
                ,   td.descripcion
                ,   td.codigo
                ,   f.subTotalSinImpuestos
                ,   f.totalDescuento
                ,   f.porcentajeDescuento
                ,   f.propina
                ,   f.recargo
                ,   f.transporte
                ,   f.total
                ,   f.observacion
            FROM TechnicalSupport.OrderDocument tsod    WITH (NOLOCK)
            INNER JOIN TipoDocumento td                 WITH (NOLOCK) ON td.idTipoDocumento = tsod.TipoDocumentoId
            INNER JOIN Factura f                        WITH (NOLOCK) ON f.idFactura = tsod.DocumentoId
            WHERE tsod.OrderId = @id

            UNION

            SELECT tsod.DocumentoId 
                ,   tsod.TipoDocumentoId
                ,   td.descripcion
                ,   td.codigo
                ,   ne.subTotalSinImpuestos
                ,   ne.totalDescuento
                ,   ne.porcentajeDescuento
                ,   ne.propina
                ,   ne.recargo
                ,   ne.transporte
                ,   ne.total
                ,   ne.observacion
            FROM TechnicalSupport.OrderDocument tsod
            INNER JOIN TipoDocumento td                 WITH (NOLOCK) ON td.idTipoDocumento = tsod.TipoDocumentoId
            INNER JOIN NotaEntrega ne                   WITH(NOLOCK) ON ne.idNotaEntrega = tsod.DocumentoId
            WHERE tsod.Orderid = @id
            
            ---- DETALLES
            SELECT fd.idFacturaDetalle              AS DocumentoDetalleId
                ,   fd.descripcion
                ,   b.descripcion                   AS Bodega
                ,   t.descripcion                   AS Tarifa
                ,   m.descripcion                   AS Medida
                ,   ti.descripcion                  AS TipoIva
                ,   fd.cantidad
                ,   fd.precioUnitario
                ,   fd.valorDescuento
                ,   fd.porcentajeDescuento
                ,   fd.precioTotalSinImpuesto
                ,   fd.nota
                ,   fd.ice
                ,   fd.precioCosto
                ,   fd.tarifa
                ,   fd.valorImpuesto
                ,   fd.valorImpuesto
                ,   fd.codigoPorcentaje
            FROM TechnicalSupport.OrderDocument tsod    WITH(NOLOCK)
            INNER JOIN FacturaDetalle fd                WITH(NOLOCK) ON fd.idFactura    = tsod.DocumentoId
            INNER JOIN Bodega b                         WITH(NOLOCK) ON b.idBodega      = fd.idBodega
            INNER JOIN Tarifa t                         WITH(NOLOCK) ON t.idTarifa      = fd.idTarifa
            INNER JOIN Medida m                         WITH(NOLOCK) ON m.idMedida      = fd.idMedida
            INNER JOIN TipoIva ti                       WITH(NOLOCK) ON ti.idTipoIva    = fd.idTipoIva
            WHERE tsod.OrderId = @id

            UNION 

            SELECT fd.idNotaEntregaDetalle          AS DocumentoDetalleId
                ,   fd.descripcion
                ,   b.descripcion                   AS Bodega
                ,   t.descripcion                   AS Tarifa
                ,   m.descripcion                   AS Medida
                ,   ti.descripcion                  AS TipoIva
                ,   fd.cantidad
                ,   fd.precioUnitario
                ,   fd.valorDescuento
                ,   fd.porcentajeDescuento
                ,   fd.precioTotalSinImpuesto
                ,   fd.nota
                ,   fd.ice
                ,   fd.precioCosto
                ,   fd.tarifa
                ,   fd.valorImpuesto
                ,   fd.valorImpuesto
                ,   fd.codigoPorcentaje
            FROM TechnicalSupport.OrderDocument tsod    WITH(NOLOCK)
            INNER JOIN NotaEntregaDetalle fd            WITH(NOLOCK) ON fd.idNotaEntrega    = tsod.DocumentoId
            INNER JOIN Bodega b                         WITH(NOLOCK) ON b.idBodega          = fd.idBodega
            INNER JOIN Tarifa t                         WITH(NOLOCK) ON t.idTarifa          = fd.idTarifa
            INNER JOIN Medida m                         WITH(NOLOCK) ON m.idMedida          = fd.idMedida
            INNER JOIN TipoIva ti                       WITH(NOLOCK) ON ti.idTipoIva        = fd.idTipoIva
            WHERE tsod.OrderId = @id
        END
END
GO