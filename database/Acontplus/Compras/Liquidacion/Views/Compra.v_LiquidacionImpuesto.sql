USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_LiquidacionImpuesto WITH SCHEMABINDING AS (

	SELECT lc.LiquidacionId 
	      ,lc.TaxId
		  ,lc.TaxPercentId
		  ,lc.[Percent]
		  ,lc.TaxBase
		  ,lc.TaxValue
          ,lc.Discount
		  ,it.codigo
		  ,ti.codigoPorcentaje
	FROM Compra.LiquidacionImpuesto lc WITH (NOLOCK)
	INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = lc.TaxPercentId
	INNER JOIN dbo.Impuesto         it WITH (NOLOCK) ON it.idImpuesto = lc.TaxId


)