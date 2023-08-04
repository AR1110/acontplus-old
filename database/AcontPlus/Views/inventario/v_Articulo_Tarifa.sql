USE AcontPlus
GO
IF OBJECT_ID(N'v_Articulo_Tarifa', N'V') IS NOT NULL
DROP VIEW v_Articulo_Tarifa
GO
CREATE VIEW v_Articulo_Tarifa AS (
	SELECT pv.idArticuloPvP
	      ,pv.idArticulo
		  ,pv.idTarifa
		  ,pv.precioConIva
		  ,pv.precioVenta
		  ,pv.precioPredeterminado
	      ,ar.idEntidad
		  ,ar.idSubFamilia
		  ,ar.descripcion
		  ,ar.codigo
		  ,ar.stock
		  ,ar.estado
		  ,ar.caducidad
		  ,ar.fechaCaducidad
		  ,sf.descripcion as subFamilia
		  ,ta.descripcion as tarifa    
	FROM Articulo          ar WITH (NOLOCK)
	INNER JOIN SubFamilia  sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia
	INNER JOIN ArticuloPvP pv WITH (NOLOCK) ON pv.idArticulo   = ar.idArticulo
	INNER JOIN Tarifa      ta WITH (NOLOCK) ON ta.idTarifa     = pv.idTarifa
 )
