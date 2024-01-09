USE Acontplus
GO
CREATE OR ALTER VIEW Inventario.v_Subfamilia WITH SCHEMABINDING AS (
	
	SELECT	s.idSubFamilia
		,s.idFamilia
		,s.descripcion
		,s.siglas
		,s.codigo
		,s.ultimoSecuencial
		,s.estado
		,s.fechaBaja
		,s.idUsuario
		,s.idEntidad
		,s.montoObjetivo
		,s.importacion
		,s.applicationId
        ,(SELECT TOP 1 s3ObjectKey FROM [Inventario].SubcategoryPhoto sp WITH (NOLOCK) WHERE sp.SubcategoryId = s.idSubFamilia AND IsDefault = 1) s3ObjectKey
		,(SELECT TOP 1 s3ObjectUrl FROM [Inventario].SubcategoryPhoto sp WITH (NOLOCK) WHERE sp.SubcategoryId = s.idSubFamilia AND IsDefault = 1) s3ObjectUrl
		,(SELECT TOP 1 Id          FROM [Inventario].SubcategoryPhoto sp WITH (NOLOCK) WHERE sp.SubcategoryId = s.idSubFamilia AND IsDefault = 1) subcategoryPhotoId
		,e.ruc
		,e.razonSocial as empresa
        ,f.descripcion as familia
	FROM dbo.SubFamilia    s WITH(NOLOCK)
    INNER JOIN dbo.Entidad e WITH(NOLOCK) ON s.idEntidad = e.idEntidad
     LEFT JOIN dbo.Familia f WITH(NOLOCK) ON f.idFamilia = s.idFamilia
)