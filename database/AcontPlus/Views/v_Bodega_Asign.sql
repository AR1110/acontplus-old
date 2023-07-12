USE AcontPlus
GO
IF OBJECT_ID(N'v_Bodega_Asign', N'V') IS NOT NULL
DROP VIEW v_Bodega_Asign
GO
CREATE VIEW v_Bodega_Asign AS (
	SELECT ba.idBodeg_Asig
	,ba.codEstab_Asig
	,ba.idBodega 
	,ba.predeterminado defaultBodega
	,ba.estado estadoBodegaAsign
	,b.descripcion bodega
	,b.estado estadoBodega
	,ea.idEstab_Asig
	,ea.codEstab
	,ea.idUsuarioRol
	,ea.predeterminado defaultEstab
	,ea.estado estadoEstabAsign
	,e.ruc
	,e.nombreComercial
	,e.estab
	,e.estado estadoEstab
	FROM Config.Bodeg_Asig ba WITH (NOLOCK)
	INNER JOIN Config.Estab_Asig ea WITH(NOLOCK) ON ba.codEstab_Asig = ea.codEstab_Asig
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON ea.codEstab = e.codEstab
	INNER JOIN Bodega b WITH (NOLOCK) ON ba.idBodega = b.idBodega
)