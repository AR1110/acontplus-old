USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaCreditoImpuesto WITH SCHEMABINDING AS (

	SELECT nc.NotaCreditoId 
	      ,nc.TaxId
		  ,nc.TaxPercentId
		  ,nc.[Percent]
		  ,nc.TaxBase
		  ,nc.TaxValue
          ,nc.Discount
		  ,it.codigo
		  ,ti.codigoPorcentaje
	FROM Ventas.NotaCreditoImpuesto nc WITH (NOLOCK)
	INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = nc.TaxPercentId
	INNER JOIN dbo.Impuesto         it WITH (NOLOCK) ON it.idImpuesto = nc.TaxId


)