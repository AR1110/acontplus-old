USE AcontPlus
GO
CREATE OR ALTER VIEW v_PtoEmi_Asign WITH SCHEMABINDING AS (
	SELECT pa.idPtoEmi_Asig
	      ,pa.codEstab_Asig
	      ,pa.idPuntoEmision
          ,pa.estado estadoPtoEmi
	      ,pt.ptoEmi
	      ,pt.ambiente
	      ,pa.predeterminado defaultPtoEmi
	      ,ea.idEstab_Asig
	      ,ea.codEstab
	      ,ea.idUsuarioRol
	      ,ea.predeterminado defaultEstab
	      ,ea.estado estadoEstabAsign
	      ,en.ruc
	      ,es.nombreComercial
	      ,es.estab
	      ,es.estado estadoEstab
          ,es.idEstablecimiento
	FROM Config.PtoEmi_Asig        pa WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision        pt WITH (NOLOCK) ON pt.idPuntoEmision = pa.idPuntoEmision
    INNER JOIN Config.Estab_Asig   ea WITH (NOLOCK) ON ea.codEstab_Asig  = pa.codEstab_Asig
	INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = ea.codEstab
    INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad      = es.idEntidad
	
)