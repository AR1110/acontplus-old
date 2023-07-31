USE AcontPlus
GO
IF OBJECT_ID(N'v_PtoEmi_Asign', N'V') IS NOT NULL
DROP VIEW v_PtoEmi_Asign
GO
CREATE VIEW v_PtoEmi_Asign AS (
	SELECT pa.idPtoEmi_Asig
	,pa.codEstab_Asig
	,pa.idPuntoEmision
	,pt.ptoEmi
	,pt.ambiente
	,pa.predeterminado defaultPtoEmi
	,pa.estado estadoPtoEmi
	,ea.idEstab_Asig
	,ea.codEstab
	,ea.idUsuarioRol
	,ea.predeterminado defaultEstab
	,ea.estado estadoEstabAsign
	,e.ruc
	,e.nombreComercial
	,e.estab
	,e.estado estadoEstab
	FROM Config.PtoEmi_Asig       pa WITH (NOLOCK)
	INNER JOIN Config.Estab_Asig  ea WITH (NOLOCK) ON pa.codEstab_Asig  = ea.codEstab_Asig
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON ea.codEstab       = e.codEstab
	INNER JOIN PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = pa.idPuntoEmision
)