USE ACONTPLUS
GO
IF OBJECT_ID(N'v_Articulo', N'V') IS NOT NULL
DROP VIEW v_Articulo
GO
CREATE VIEW v_Articulo AS (
SELECT a.*
,e.razonSocial entidad
,m.descripcion medida
,sf.descripcion subfamilia
,modelo.descripcion modelo
FROM Articulo a WITH(NOLOCK) 
INNER JOIN Entidad e WITH(NOLOCK) ON a.idEntidad = e.idEntidad
INNER JOIN TipoIva ti WITH(NOLOCK) ON a.idTipoIva = ti.idTipoIva
LEFT JOIN Modelo modelo  WITH(NOLOCK) ON a.idModelo = modelo.idModelo
LEFT JOIN Marca m  WITH(NOLOCK) ON a.idMarca = m.idMarca
LEFT JOIN Familia f WITH(NOLOCK) ON a.idFamilia = f.idFamilia
LEFT JOIN Usuario u WITH(NOLOCK) ON a.idUsuario = u.idUsuario
LEFT JOIN SubFamilia sf WITH(NOLOCK) ON a.idSubfamilia = sf.idSubfamilia
)