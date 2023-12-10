USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_FacturaImpuesto WITH SCHEMABINDING AS (

	SELECT fi.FacturaId 
	      ,fi.TaxId
		  ,fi.TaxPercentId
		  ,fi.[Percent]
		  ,fi.TaxBase
		  ,fi.TaxValue
          ,fi.Discount
		  ,it.codigo
		  ,ti.codigoPorcentaje
	FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
	INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
	INNER JOIN dbo.Impuesto     it WITH (NOLOCK) ON it.idImpuesto = fi.TaxId


)

