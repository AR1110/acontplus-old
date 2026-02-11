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
CREATE OR ALTER PROCEDURE Restaurant.PromotionGetById
    @UserRoleId INT
   ,@Id INT
   ,@TableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    SET @TableNames = 'promotions,details'

    SELECT *
    FROM Restaurant.Promotion WITH (NOLOCK)
    WHERE Id =  @id

    SELECT pd.[Id]
          ,pd.[PromotionId]
          ,pd.[ItemId]
          ,pd.[FeeId]
          ,pd.[TaxId]
          ,pd.[MeasureId]
          ,pd.[UnitPrice]
          ,pd.[PromotionalPrice]
          ,pd.[DiscountPercent]
          ,pd.[Discount]
          ,pd.[Subtotal]
          ,pd.[BuyQuantity]
          ,pd.[GetQuantity]
          ,pd.[Notes]
          ,pd.[RequiredQuantity]
	      ,it.Summary
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
    FROM Restaurant.PromotionDetail  pd WITH (NOLOCK)
    INNER JOIN Restaurant.Item       it WITH (NOLOCK) ON it.Id               = pd.ItemId
    INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa         = pd.FeeId
    INNER JOIN dbo.Medida            me WITH (NOLOCK) ON me.idMedida         = pd.MeasureId
    INNER JOIN Sri.TarifaImpuesto    ti WITH (NOLOCK) ON ti.idTarifaImpuesto = pd.TaxId
    INNER JOIN dbo.Articulo          ar WITH (NOLOCK) ON ar.idArticulo       = it.ProductId
    WHERE pd.IsActive    = 1
      AND pd.PromotionId = @id

END
GO
