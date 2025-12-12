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
CREATE OR ALTER PROCEDURE Restaurant.GetByIdOrder
    @UserRoleId INT
   ,@Id INT
   ,@TableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    SET @TableNames = 'order,details,orderDocument,compositionModifiers'

    SELECT ro.*
          ,cu.BusinessName
          ,cu.IdCard
          ,us.nombreUsuario as CreatedByUser
          ,ta.[Description] as [Table]
    FROM Restaurant.[Order]       ro
    INNER JOIN dbo.Cliente        cl ON cl.idCliente = ro.CustomerCompanyId
     LEFT JOIN dbo.Usuario        us ON us.idUsuario = ro.CreatedByUserId
     LEFT JOIN Restaurant.[Table] ta ON ta.Id        = ro.TableId
    INNER JOIN Customer.Customer  cu ON cu.Id        = cl.CustomerId
    WHERE ro.Id =  @id

    SELECT od.[Id]
          ,od.[ItemId]
          ,od.[FeeId]
          ,od.[TaxPercentId]
          ,od.[WarehouseId]
          ,od.[MeasureId]
          ,od.[TaxValue]
          ,od.[Quantity]
          ,od.[SalePrice]
          ,od.[Discount]
          ,od.[DiscountPercent]
          ,od.[UnitPrice]
          ,od.[Subtotal]
          ,od.[Total]
          ,od.[obs]
          ,od.[RemainingQuantity]
          ,od.[IsActive]
	      ,it.Summary
          ,it.ProductId
	      ,ISNULL
           ((
              SELECT af.idMedida
                    ,IIF(af.gestionVenta = 1,1,3) as orden
                    ,af.conversion
                    ,af.precioCostoFraccionado
                    ,sa.precioCosto
			        ,me.descripcion               as descripcion
			        ,(
                        SELECT pv.idTarifa
                                ,pv.precioVenta
                                ,pv.precioConIva
                                ,UPPER(ta.descripcion) as tarifa
                                ,ta.ventaPorMayor
					    FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					    INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					    WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					    ORDER BY ta.predeterminada DESC 
                        FOR JSON PATH

                    ) as tarifas
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
            INNER JOIN dbo.Articulo      sa WITH (NOLOCK) ON sa.idArticulo = af.idArticulo
			WHERE af.idArticulo = ar.idArticulo 
            FOR JSON PATH
                
         ),'[]') as fractional

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
					        FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					        INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					        WHERE ap.idArticulo = sc.idArticulo
					        ORDER BY ta.predeterminada DESC 
                            FOR JSON PATH

                       ) as tarifas
			    FROM dbo.Articulo     sc WITH (NOLOCK)
			    INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			    WHERE sc.idArticulo = ar.idArticulo 
                FOR JSON PATH

        ),'[]') as principal
        ,ar.descripcion as [Description]
        ,ar.codigo      as Code
        ,ta.descripcion as Fee
        ,me.descripcion as Measure
        ,ti.codigo      as CodePercentage
        ,ti.descripcion as Tax
        ,ti.IdImpuesto  as TaxId
        ,ti.porcentaje  as [Percentage]
        ,td.idTipoIva   as TaxPercentOldId
        ,ISNULL
          ((
		        SELECT sc.id
			          ,sc.parentItemId
			          ,sc.parentCompositionId
			          ,sc.childItemId
			          ,sc.feeId
			          ,sc.measureId
			          ,sc.quantity
			          ,sc.salePrice
			          ,sc.unitPrice
			          ,sc.totalCost
			          ,sc.uniqueId
			          ,sc.totalPrice
			          ,sc.isOptional
			          ,si.summary
			          ,ISNULL
			           ((
				          SELECT af.idMedida
						        ,IIF(af.gestionVenta = 1,1,3) as orden
						        ,af.conversion
						        ,af.precioCostoFraccionado
						        ,ss.precioCosto
						        ,me.descripcion               as descripcion
						        ,(
							        SELECT pv.idTarifa
								          ,pv.precioVenta
								          ,pv.precioConIva
								          ,UPPER(ta.descripcion) as tarifa
								          ,ta.ventaPorMayor
							        FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
							        INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
							        WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
							        ORDER BY ta.predeterminada DESC 
							        FOR JSON PATH

						        ) as tarifas
				          FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
				          INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
				          INNER JOIN dbo.Articulo      ss WITH (NOLOCK) ON ss.idArticulo = af.idArticulo
				          WHERE af.idArticulo = sa.idArticulo 
				          FOR JSON PATH
                
				        ),'[]') as fractional

				        ,ISNULL
				         ((
						        SELECT ss.idMedida
							          ,2              as orden
							          ,1              as conversion
							          ,ss.precioCosto as precioCostoFraccionado
							          ,ss.precioCosto
							          ,me.descripcion
							          ,(
									        SELECT ap.idTarifa
										          ,ap.precioVenta
										          ,ap.precioConIva
										          ,UPPER(ta.descripcion) as tarifa
										          ,ta.ventaPorMayor 
									        FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
									        INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
									        WHERE ap.idArticulo = ss.idArticulo
									        ORDER BY ta.predeterminada DESC 
									        FOR JSON PATH

							           ) as tarifas
						        FROM dbo.Articulo     ss WITH (NOLOCK)
						        INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = ss.idMedida
						        WHERE ss.idArticulo = sa.idArticulo 
						        FOR JSON PATH

				        ),'[]') as principal
			          ,sa.descripcion as [description]
		              ,sa.codigo      as code
		              ,st.descripcion as fee
		              ,sm.descripcion as measure
		              ,sp.S3ObjectUrl as imageUrl
		        FROM Restaurant.ItemComposition    sc 
		        INNER JOIN Restaurant.Item         si ON si.Id         = sc.ChildItemId
		         LEFT JOIN dbo.Tarifa			   st ON st.idTarifa   = sc.FeeId
		         LEFT JOIN dbo.Medida			   sm ON sm.idMedida   = sc.MeasureId
		        INNER JOIN dbo.Articulo			   sa ON sa.idArticulo = si.ProductId
		         LEFT JOIN Inventario.ProductPhoto sp ON sp.ProductId  = sa.idArticulo AND sp.IsDefault = 1
		        WHERE sc.IsActive = 1 
		          AND sc.ParentItemId = od.ItemId
		        FOR JSON PATH

	    ),'[]') as ItemCompositions
    FROM Restaurant.OrderDetail      od
    INNER JOIN Restaurant.Item       it ON it.Id               = od.ItemId
    INNER JOIN dbo.Tarifa            ta ON ta.idTarifa         = od.FeeId
    INNER JOIN dbo.Medida            me ON me.idMedida         = od.MeasureId
    INNER JOIN Sri.TarifaImpuesto    ti ON ti.idTarifaImpuesto = od.TaxPercentId
    INNER JOIN dbo.Articulo          ar ON ar.idArticulo       = it.ProductId
    INNER JOIN dbo.TipoIva           td ON td.idTipoIva        = ar.idTipoIva
    WHERE od.IsActive    = 1
      AND od.OrderId = @id

    SELECT cc.idCuentaPorCobrar						  as AccountId
          ,cc.idDocumento                             as DocumentId
          ,td.codigo							      as CodDoc
          ,cc.serieComprobante					      as SerieDocument
	      ,FORMAT(cc.fechaEmision,'dd-MM-yyyy HH:mm') as [Date]
	      ,cc.importeTotal						      as Total
	      ,cc.abono								      as PaidAmount 
	      ,cc.saldo							          as RemainingAmount  
	      ,ep.descripcion                             as StatusDocument
          ,cu.IdCard
		  ,cu.BusinessName
    FROM  Restaurant.OrderDocument          dt 
    INNER JOIN dbo.TipoDocumento		    td ON td.idTipoDocumento = dt.TipoDocumentoId
    INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento     = dt.DocumentoId AND cc.codDoc = IIF(td.codigo = 'FV','01', td.codigo)
    INNER JOIN dbo.EstadoPago	            ep ON ep.idEstadoPago    = cc.idEstadoPago
    INNER JOIN dbo.Cliente                  cl ON cl.idCliente       = cc.idCliente
    INNER JOIN Customer.Customer            cu ON cu.Id              = cl.CustomerId
    WHERE dt.OrderId = @Id
      AND dt.IsActive = 1

    SELECT om.Id
          ,om.OrderDetailId
          ,om.ModifierCompositionId
          ,om.Quantity
          ,om.[ExtraCharge]
          ,om.[Instructions]
    FROM Restaurant.OrderDetailCompositionModifier om
    INNER JOIN Restaurant.OrderDetail		       od ON od.Id         = om.OrderDetailId
    INNER JOIN Restaurant.ItemComposition          ic ON ic.Id         = om.ModifierCompositionId
    INNER JOIN Restaurant.Item                     it ON it.Id         = ic.ChildItemId
    INNER JOIN dbo.Articulo						   ar ON ar.idArticulo = it.ProductId
    WHERE od.OrderId = @Id
      AND om.IsActive = 1
END
GO
