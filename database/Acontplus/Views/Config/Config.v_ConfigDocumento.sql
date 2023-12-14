use Acontplus
GO
IF OBJECT_ID(N'v_ConfigDocumento', N'V') IS NOT NULL
    DROP VIEW v_ConfigDocumento
GO
CREATE OR ALTER VIEW Config.v_ConfigDocumento WITH SCHEMABINDING
AS
(
    SELECT cd.[idConfiguracionDocumento]
        ,cd.[idPuntoEmision]
        ,cd.[idTipoDocumento]
        ,cd.[generacionNro]
        ,cd.[ultimaSecuencia]
        ,cd.[codigoAmbiente]
        ,cd.[estado]
        ,cd.[fechaRegistro]
        ,cd.[idUsuario]
		,es.idEstablecimiento
		,es.codEstab
        ,es.autoSriAuth
		,td.codigo as codDoc
		,td.codigoSri as codDocSri
		,td.descripcion as documento
		,es.ruc
		,es.estab
		,pt.ptoEmi
		,pt.ambiente
		,secuencial = cd.ultimaSecuencia 
	FROM dbo.ConfiguracionDocumento    cd WITH (NOLOCK)
	INNER JOIN dbo.TipoDocumento       td WITH (NOLOCK) ON td.idTipoDocumento = cd.idTipoDocumento
	INNER JOIN dbo.PuntoEmision        pt WITH (NOLOCK) ON pt.idPuntoEmision  = cd.idPuntoEmision
	INNER JOIN sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = pt.codEstab
)