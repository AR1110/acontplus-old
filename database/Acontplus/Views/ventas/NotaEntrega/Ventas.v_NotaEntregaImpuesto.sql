USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaEntregaImpuesto WITH SCHEMABINDING AS (

	SELECT ni.NotaEntregaId 
	      ,ni.TaxId
		  ,ni.TaxPercentId
		  ,ni.[Percent]
		  ,ni.TaxBase
		  ,ni.TaxValue
          ,ni.Discount
		  ,it.codigo
		  ,ti.codigoPorcentaje
	FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK)
	INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
	INNER JOIN dbo.Impuesto         it WITH (NOLOCK) ON it.idImpuesto = ni.TaxId


)
