USE ACONTPLUS
GO
IF OBJECT_ID(N'v_Articulo_Ubicacion', N'V') IS NOT NULL
DROP VIEW v_Articulo_Ubicacion
GO
CREATE VIEW v_Articulo_Ubicacion AS (
SELECT au.*
,a.descripcion articulo
,b.descripcion bodega
FROM ArticuloUbicacion au WITH(NOLOCK) 
INNER JOIN Articulo a WITH(NOLOCK)  ON au.idArticulo = a.idArticulo
INNER JOIN Bodega b  WITH(NOLOCK)  ON au.idBodega = b.idBodega
)