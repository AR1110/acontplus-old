USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo_Tarifa WITH SCHEMABINDING AS (
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
		  ,CASE WHEN ar.caducidad = 1 THEN DATEDIFF(DAY,ar.fechaCaducidad,GETDATE()) ELSE 0 END as diasCaducidad
		  ,sf.descripcion as subFamilia
		  ,ta.descripcion as tarifa    
	FROM dbo.Articulo          ar WITH (NOLOCK)
	INNER JOIN dbo.SubFamilia  sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia
	INNER JOIN dbo.ArticuloPvP pv WITH (NOLOCK) ON pv.idArticulo   = ar.idArticulo
	INNER JOIN dbo.Tarifa      ta WITH (NOLOCK) ON ta.idTarifa     = pv.idTarifa
 )
