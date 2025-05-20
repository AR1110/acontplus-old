USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_ProformaImpuesto WITH SCHEMABINDING AS (

	SELECT pm.ProformaId 
	      ,pm.TaxId
		  ,pm.TaxPercentId
		  ,pm.[Percent]
		  ,pm.TaxBase
		  ,pm.TaxValue
          ,pm.Discount
		  ,it.codigo
		  ,ti.codigoPorcentaje
	FROM Ventas.ProformaImpuesto    pm WITH (NOLOCK)
	INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = pm.TaxPercentId
	INNER JOIN dbo.Impuesto         it WITH (NOLOCK) ON it.idImpuesto = pm.TaxId


)
