USE AcontPlus
GO
IF OBJECT_ID(N'v_Articulo_Stock', N'V') IS NOT NULL
DROP VIEW v_Articulo_Stock
GO
CREATE VIEW v_Articulo_Stock AS (
	SELECT st.* 
		  ,ar.idEntidad
		  ,ar.idSubFamilia
		  ,ar.descripcion
		  ,ar.codigo
		  ,ar.estado
		  ,ar.precioCosto
		  ,ar.stock
		  ,sf.descripcion as subfamilia
		  ,bo.descripcion as bodega
		  ,ubicacion = (SELECT ubicacion FROM ArticuloUbicacion au WITH (NOLOCK) WHERE au.idArticulo = st.idArticulo AND au.idBodega = st.idBodega)
	FROM Articulo                ar WITH (NOLOCK)
	INNER JOIN SubFamilia        sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia
	INNER JOIN Inventario.Stock  st WITH (NOLOCK) ON st.idArticulo   = ar.idArticulo
	INNER JOIN Bodega            bo WITH (NOLOCK) ON bo.idBodega     = st.idBodega		 
 )

