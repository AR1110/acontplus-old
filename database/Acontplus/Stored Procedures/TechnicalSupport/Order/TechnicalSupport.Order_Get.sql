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

	SELECT @id = id
        ,@orderStatusCode = orderStatusCode
        ,@pageIndex = pageIndex
        ,@pageSize = pageSize
        ,@tipo = tipo
    FROM OPENJSON (@json) WITH 
    (
        id              INT '$.id',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode',
        tipo            INT         '$.tipo',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode',
        pageIndex       INT '$.pageIndex',
        pageSize        INT '$.pageSize'
    )
	
    SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)

	IF @tipo = 1
		BEGIN
			SET @tableNames = 'puntosEmision,bodegas,categories,users'
			SELECT * FROM v_PtoEmi_Asign WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WHERE idUsuarioRol = @userRoleId
            SELECT * FROM TechnicalSupport.Category WITH(NOLOCK) WHERE [Enabled] = 1
            SELECT * FROM v_usuario WHERE idEntidad = @companyId AND estadoUsuario = 1 
		END

   IF @tipo = 2
    BEGIN
        SET @tableNames = 'orders'
        
        SELECT tor.Id
            ,tor.Uuid
            ,tor.Sequence
            ,tor.Serie
            ,ISNULL(tor.Tax, 0.0)       AS Tax
            ,ISNULL(tor.Discount, 0.0)  AS Discount
            ,ISNULL(tor.Tip, 0.0)       AS Tip
            ,ISNULL(tor.Total, 0.0)     AS Total
            ,ISNULL(tor.Obs, '')        AS obs
            ,tor.Enabled
            ,tor.CustomerCompanyId
            ,c.nombreFiscal
            ,e.codEstab
            ,totalRecords       = COUNT(*) OVER()
        FROM TechnicalSupport.[Order] tor WITH (NOLOCK)
        INNER JOIN Cliente c               WITH (NOLOCK)         ON c.idCliente = tor.CustomerCompanyId
        INNER JOIN TechnicalSupport.OrderStatus sc WITH (NOLOCK)  ON sc.Id = tor.OrderStatusId
        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON tor.EstablecimientoId = e.idEstablecimiento
        WHERE sc.Code = @orderStatusCode
            AND tor.Deleted IS NULL
        ORDER BY tor.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY   
        RETURN
    END
    IF @tipo = 4
        BEGIN
            SET @tableNames = 'order,orderDetails,orderMaintenances,feeds,estabs,puntosEmision,bodegas,taxes,taxPercents,decimalsConfig'
        
            SELECT tor.Id
                ,tor.Uuid
                ,tor.Sequence
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

            SELECT o.*, d.Id DeviceId, d.[Name] DeviceName FROM TechnicalSupport.[OrderDetail] o WITH (NOLOCK) 
                INNER JOIN TechnicalSupport.Device d WITH (NOLOCK) ON o.DeviceId = d.Id
            WHERE OrderId = @id

            SELECT om.Id
                  ,om.ProductId
                  ,om.BodegaId
                  ,om.FeeId
                  ,om.MedidaId
                  ,om.Quantity
                  ,om.Price
                  ,om.Price
                  ,om.Cost
                  ,om.TaxId
                  ,om.TaxPercentId
                  ,om.TaxValue
                  ,bo.codEstab
                  ,om.Total 
                  ,a.descripcion productName
                  ,a.llevaInventario
                  ,a.idTipoIva
                  ,a.iva
                  ,a.stockMinimo
                  ,a.stock
                  ,a.precioSinSubsidio
                  ,a.codigo            AS codigoArticulo
                  ,a.codigoAuxiliar    AS codigoAuxiliar
                  ,0                    AS valorDescuento
                  ,om.[Enabled]         AS estado
                  ,ISNULL((SELECT idMedida     = m.idMedida 
			        ,descripcion  = m.descripcion
			        ,tarifas      = (SELECT afs.idTarifa,afs.precioVenta,afs.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor
								     FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								     INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								     WHERE afs.idArticuloFraccionado =af.idArticuloFraccionado
								     ORDER BY ta.predeterminada DESC FOR JSON PATH)
			        ,orden = IIF(af.gestionVenta = 1,1,3)
                    ,af.conversion
			      FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			      INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			      WHERE af.idArticulo = om.ProductId AND af.estado = 1 FOR JSON PATH),'[]') as fraccionado
                 ,(
                    SELECT m.idMedida
			              ,m.descripcion
			              ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor 
								            FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								            INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								            WHERE ap.idArticulo = a.idArticulo
								            ORDER BY ta.predeterminada DESC FOR JSON PATH)
			              ,orden = 2
                          ,1 as conversion
			        FROM dbo.Articulo     a WITH (NOLOCK)
			        INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			        WHERE a.idArticulo = om.ProductId AND a.estado = 1 FOR JSON PATH
                 ) as principal
                 ,(
                    SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = om.ProductId AND st.idBodega = om.BodegaId FOR JSON PATH
                 ) as consolidacion
            FROM TechnicalSupport.[OrderMaintenance] om    WITH (NOLOCK)
            INNER JOIN TechnicalSupport.[OrderDetail] od ON om.OrderDetailId = od.Id
            INNER JOIN dbo.Bodega bo            WITH (NOLOCK) ON bo.idBodega   = om.BodegaId
            INNER JOIN Inventario.v_Articulo a WITH (NOLOCK) ON a.idArticulo = om.ProductId
            WHERE od.Id = @Id
            
            SELECT 
			    af.idArticulo
               ,af.idMedida
			   ,descripcion 
			   ,tarifas		 = (SELECT afs.idTarifa
                                      ,afs.precioVenta
                                      ,afs.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
								FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								ORDER BY ta.predeterminada DESC FOR JSON PATH
                                )
			   ,orden = IIF(af.gestionVenta = 1,1,3)
               ,af.conversion
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			WHERE af.idArticulo IN (SELECT ProductId FROM TechnicalSupport.OrderMaintenance om WITH (NOLOCK)
                                                          INNER JOIN TechnicalSupport.OrderDetail od WITH (NOLOCK) ON om.OrderDetailId = od.Id  WHERE od.OrderId = @Id)
		
			UNION ALL

			SELECT 
			    a.idArticulo
               ,m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa
                                      ,ap.precioVenta
                                      ,ap.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
								FROM v_ArticuloPvp ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			  ,orden = 2
              ,conversion = 0
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo IN (SELECT ProductId FROM TechnicalSupport.OrderMaintenance om WITH (NOLOCK)
                                                          INNER JOIN TechnicalSupport.OrderDetail od WITH (NOLOCK) ON om.OrderDetailId = od.Id  WHERE od.OrderId = @Id)
			ORDER BY orden ASC
                       
            SELECT idEstablecimiento
                    , codEstab
                    , predeterminado
                    , nombreComercial
                    , estab
                    , tarifasImpuestos = (
					    SELECT
						    'IVA ' + descripcion AS descripcion,
						    'IVA' AS codigo,
						    codigo AS codigoPorcentaje,
						    porcentaje AS tarifa
					    FROM Sri.TarifaImpuesto ti WITH (NOLOCK)
					    WHERE ti.estado = 1 
                        AND ((e.actividad = '01' AND ti.codigo IN ('2', '8')) OR (e.actividad <> '01' AND codigo = '2') )
					    ORDER BY codigoPorcentaje DESC
					    FOR JSON PATH
				    )
            FROM v_Estab_Asign e
            WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId 
            ORDER BY predeterminado DESC

            SELECT pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
	        FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
	        INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
	        INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 	        WHERE ea.idUsuarioRol = @userRoleId

            SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

            SELECT * FROM Sri.Impuesto WITH (NOLOCK)

	        SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK)

            SELECT * FROM  Config.v_Sistema_Decimal WHERE idEntidad = @companyId AND codTrasaccion = 'V'
            RETURN
        END
END
GO