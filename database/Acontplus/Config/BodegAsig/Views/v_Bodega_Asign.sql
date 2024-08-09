USE AcontPlus
GO
CREATE OR ALTER VIEW v_Bodega_Asign WITH SCHEMABINDING AS (
	SELECT ba.idBodeg_Asig
	      ,ba.codEstab_Asig
	      ,ba.idBodega 
	      ,ba.predeterminado defaultBodega
	      ,ba.estado estadoBodegaAsign
	      ,bo.descripcion bodega
	      ,bo.estado estadoBodega
	      ,ea.idEstab_Asig
	      ,ea.codEstab
	      ,ea.idUsuarioRol
	      ,ea.predeterminado defaultEstab
	      ,ea.estado estadoEstabAsign
	      ,en.ruc
          ,es.idEstablecimiento
	      ,es.nombreComercial
	      ,es.estab
	      ,es.estado estadoEstab
	FROM Config.Bodeg_Asig          ba WITH (NOLOCK)
	INNER JOIN Config.Estab_Asig    ea WITH(NOLOCK)  ON ea.codEstab_Asig = ba.codEstab_Asig
    INNER JOIN dbo.Bodega               bo WITH (NOLOCK) ON bo.idBodega      = ba.idBodega
	INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.codEstab      = ea.codEstab
    INNER JOIN dbo.Entidad          en WITH (NOLOCK) ON en.idEntidad     = es.idEntidad
	
)