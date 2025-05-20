USE AcontPlus
GO
CREATE OR ALTER VIEW Config.v_Estab_Asign WITH SCHEMABINDING AS (
	SELECT ea.codEstab
          ,en.ruc
          ,es.idEstablecimiento
	      ,es.nombreComercial
	      ,es.estado estadoEstab
	      ,es.agenteRetencion
	      ,es.estab
	      ,es.contribuyenteEspecial
	      ,es.obligadoContabilidad
	      ,es.dirEstablecimiento
	      ,es.contribuyenteRimpe
	      ,es.actividad
          ,ae.idActividadEconomica AS ActividadEconomicaId 
          ,es.telefono
          ,es.correo
          ,ea.idUsuarioRol
          ,ea.predeterminado
	FROM Config.Estab_Asig            ea WITH (NOLOCK)     
	INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab  = ea.codEstab
    INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo    = es.actividad 
    INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
)