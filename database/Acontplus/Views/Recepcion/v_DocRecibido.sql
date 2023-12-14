USE Acontplus
GO
IF OBJECT_ID(N'v_DocRecibido', N'V') IS NOT NULL
DROP VIEW v_DocRecibido
GO
CREATE VIEW v_DocRecibido WITH SCHEMABINDING AS (
	
	SELECT rd.idDocumento
        ,rd.idEstablecimiento
        ,rd.codEstab
        ,rd.comprobante
        ,rd.codDoc
        ,rd.serieComprobante
        ,rd.rucEmisor
        ,rd.razonSocialEmisior
        ,rd.fechaEmision
        ,rd.fechaAutorizacion
        ,rd.tipoEmision
        ,rd.identificacionReceptor
        ,rd.claveAcceso
        ,rd.numeroAutorizacion
        ,rd.importeTotal
        ,rd.xmlDoc
        ,rd.versionComp
        ,rd.downloaded
        ,rd.complete
        ,rd.obs
        ,rd.fechaRegistro
        ,rd.idUsuario
        ,e.ruc
        ,en.razonSocial empresa
        ,en.idEntidad
	FROM Recepcion.DocumentoRecibido rd WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON rd.idEstablecimiento = e.idEstablecimiento
	INNER JOIN dbo.Entidad en WITH (NOLOCK) ON e.ruc = en.ruc 
)