USE AcontPlus
GO
CREATE OR ALTER VIEW Config.v_Estab_Asign WITH SCHEMABINDING AS (
	SELECT ea.codEstab
          ,e.idEstablecimiento
	      ,e.ruc
	      ,e.nombreComercial
	      ,e.estado estadoEstab
	      ,e.agenteRetencion
	      ,e.estab
	      ,e.contribuyenteEspecial
	      ,e.obligadoContabilidad
	      ,e.dirEstablecimiento
	      ,e.contribuyenteRimpe
	      ,e.actividad
          ,ae.idActividadEconomica AS ActividadEconomicaId 
          ,e.telefono
          ,e.correo
	FROM Config.Estab_Asig ea WITH (NOLOCK)     
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON ea.codEstab = e.codEstab
    INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo = e.actividad 
)