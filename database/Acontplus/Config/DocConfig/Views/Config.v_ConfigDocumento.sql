use Acontplus
GO
CREATE OR ALTER VIEW Config.v_ConfigDocumento WITH SCHEMABINDING
AS
(
    SELECT cd.[idConfiguracionDocumento]
          ,cd.[idPuntoEmision]
          ,cd.[idTipoDocumento]
          ,cd.[ultimaSecuencia]
          ,cd.[estado]
          ,cd.[fechaRegistro]
          ,cd.ultimaSecuencia as secuencial 
          ,cd.[idUsuario]
		  ,td.codigo          as codDoc
		  ,td.codigoSri       as codDocSri
		  ,td.descripcion     as documento
		  ,en.ruc
		  ,es.estab
          ,es.idEstablecimiento
		  ,es.codEstab
          ,es.autoSriAuth
		  ,pt.ptoEmi
		  ,pt.ambiente
	FROM dbo.ConfiguracionDocumento    cd WITH (NOLOCK)
	INNER JOIN dbo.TipoDocumento       td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento
	INNER JOIN dbo.PuntoEmision        pt WITH (NOLOCK) ON pt.idPuntoEmision    = cd.idPuntoEmision
	INNER JOIN Sri.Establecimiento     es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
    INNER JOIN dbo.Entidad             en WITH (NOLOCK) ON en.idEntidad         = es.idEntidad
)