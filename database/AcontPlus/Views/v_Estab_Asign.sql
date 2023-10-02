USE AcontPlus
GO
IF OBJECT_ID(N'v_Estab_Asign', N'V') IS NOT NULL
DROP VIEW v_Estab_Asign
GO
CREATE VIEW v_Estab_Asign AS (
	SELECT ea.*
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