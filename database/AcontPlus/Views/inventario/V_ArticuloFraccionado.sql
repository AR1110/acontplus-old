use AcontPlus
go
--USAR ESTE UNA VEZ ACTUALIZADO TODO
IF OBJECT_ID(N'v_Articulo_Fraccionado', N'V') IS NOT NULL
	DROP VIEW v_Articulo_Fraccionado
GO
 

CREATE VIEW v_Articulo_Fraccionado AS (
	
	SELECT af.idArticulo
	      ,af.idArticuloFraccionado
		  ,af.idEntidad
		  ,af.idUsuario
		  ,ar.codigo
		  ,articulo           = ar.descripcion
		  ,medida             = me.descripcion
		  ,ar.stock
		  ,medidaFraccionada  = mf.descripcion
		  ,af.conversion
		  ,catidadFraccionado = CAST(ar.stock / af.conversion AS NUMERIC(18,0))
		  ,sobrante           = CAST(ar.stock - ((ar.stock / af.conversion) * af.conversion) AS NUMERIC(18,2))
	FROM ArticuloFraccionado af WITH (NOLOCK)
	INNER JOIN Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
	INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = ar.idMedida 
	INNER JOIN Medida        mf WITH (NOLOCK) ON mf.idMedida   = af.idMedida
) 