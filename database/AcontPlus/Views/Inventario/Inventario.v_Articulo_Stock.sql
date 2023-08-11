USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo_Stock WITH SCHEMABINDING AS (
	SELECT st.idStock
		  ,st.idBodega
		  ,st.idArticulo
		  ,st.cantidad
		  ,ar.idEntidad
		  ,ar.idSubFamilia
		  ,ar.descripcion
		  ,ar.codigo
		  ,ar.estado
		  ,ar.precioCosto
		  ,ar.stock
		  ,ar.caducidad
		  ,ar.fechaCaducidad
		  ,CASE WHEN ar.caducidad = 1 THEN DATEDIFF(DAY,GETDATE(),ar.fechaCaducidad) ELSE 0 END as diasCaducidad
		  ,sf.descripcion as subfamilia
		  ,bo.descripcion as bodega
		  ,ubicacion = (SELECT ubicacion FROM dbo.ArticuloUbicacion au WITH (NOLOCK) WHERE au.idArticulo = st.idArticulo AND au.idBodega = st.idBodega)
	      ,me.descripcion as medida
	FROM dbo.Articulo            ar WITH (NOLOCK)
	INNER JOIN dbo.SubFamilia    sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia
	INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida     = ar.idMedida
	INNER JOIN Inventario.Stock  st WITH (NOLOCK) ON st.idArticulo   = ar.idArticulo
	INNER JOIN dbo.Bodega        bo WITH (NOLOCK) ON bo.idBodega     = st.idBodega		 
 )

