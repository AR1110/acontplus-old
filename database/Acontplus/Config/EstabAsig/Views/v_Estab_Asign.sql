USE AcontPlus
GO

CREATE OR ALTER VIEW v_Estab_Asign AS (
	SELECT ea.*
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
          ,es.telefono
          ,es.correo
          ,ae.idActividadEconomica AS ActividadEconomicaId 
	FROM Config.Estab_Asig            ea WITH (NOLOCK)     
	INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab  = ea.codEstab
    INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo    = es.actividad 
    INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
	
)