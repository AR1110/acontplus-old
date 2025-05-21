USE AcontPlus
GO

CREATE OR ALTER VIEW v_Estab_Asign   AS (
	SELECT ea.[idEstab_Asig]
          ,ea.[codEstab_Asig]
          ,ea.[idUsuarioRol]
          ,ea.[codEstab]
          ,ea.[predeterminado]
          ,ea.[usuario]
          ,ea.[fechaRegistro]
          ,ea.[estado]
          ,idEstablecimiento = ISNULL(ea.[idEstablecimiento], es.idEstablecimiento)
          ,ea.[idUsuario]
          ,ea.[fromMobile]
	      ,en.ruc
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