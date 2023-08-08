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
		,s.imgUrl
		,s.applicationId
		,e.ruc
		,e.razonSocial empresa
	FROM dbo.SubFamilia s WITH(NOLOCK)
		INNER JOIN dbo.Entidad e  WITH(NOLOCK) ON s.idEntidad = e.idEntidad
)