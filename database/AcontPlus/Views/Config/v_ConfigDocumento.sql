use Acontplus
GO
IF OBJECT_ID(N'v_ConfigDocumento', N'V') IS NOT NULL
DROP VIEW v_ConfigDocumento
GO
CREATE VIEW v_ConfigDocumento
AS
(
    SELECT cd.*
		  ,es.idEstablecimiento
		  ,es.codEstab
		  ,td.codigo as codDoc
		  ,td.codigoSri as codDocSri
		  ,td.descripcion as documento
		  ,es.ruc
		  ,es.estab
		  ,pt.ptoEmi
		  ,pt.ambiente
		  ,secuencial = cd.ultimaSecuencia 
	FROM ConfiguracionDocumento    cd WITH (NOLOCK)
	INNER JOIN TipoDocumento       td WITH (NOLOCK) ON td.idTipoDocumento = cd.idTipoDocumento
	INNER JOIN PuntoEmision        pt WITH (NOLOCK) ON pt.idPuntoEmision  = cd.idPuntoEmision
	INNER JOIN sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = pt.codEstab
)