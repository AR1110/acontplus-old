USE Acontplus
GO 
CREATE OR ALTER VIEW FactElect.v_DocElectronico WITH SCHEMABINDING AS (
    SELECT de.idDocumentoElectronico
          ,de.idUsuario
          ,de.idPuntoEmision
          ,de.idEstadoServicio
          ,de.isAutomatic
          ,de.CustomerId
          ,de.versionComp
          ,de.serieComprobante
          ,de.nroDocumento                                                                                as secuencial
          ,de.fechaEmision
          ,de.xmlAcontPlus
          ,CONVERT(XML, DECOMPRESS(de.xmlCompressed))                                                     as xmlSri
          ,de.claveAcceso                                                                                 as codigoAutorizacion
          ,de.fechaAutorizacion
          ,de.claveAcceso
          ,en.razonSocial                                                                                 as entidad
          ,en.ruc
          ,pe.ambiente                                                                                    as codAmbiente
          ,CASE WHEN pe.ambiente = '2' THEN 'PRODUCCIÓN' ELSE 'PRUEBAS' END                               as ambiente
          ,td.codigoSri                                                                                   as codDoc
          ,td.descripcion                                                                                 as comprobante
          ,se.codEstab
          ,se.estab
          ,se.idEstablecimiento
          ,se.idEntidad
          ,se.nombreComercial
          ,se.estado                                                                                      as estadoEstablecimiento
          ,pe.ptoEmi
          ,cs.BusinessName                                                                                as razonSocial 
          ,cs.IDCard rucReceptor
          ,es.codigo AS codEstado
          ,es.descripcion estado
          ,de.fechaRegistro
          ,ISNULL(se.telefono, '') as telefonoEstablecimiento
          ,us.nombreUsuario        as usuario
          ,cs.Email emailReceptor
    FROM dbo.DocumentoElectronico       de WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision    = de.idPuntoEmision
    INNER JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON es.idEstadoServicio  = de.idEstadoServicio
    INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento   = de.idTipoDocumento
    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento = pe.idEstablecimiento
    INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad         = se.idEntidad
    INNER JOIN Customer.Customer        cs WITH (NOLOCK) ON cs.Id                = de.customerId
    LEFT JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario         = de.idUsuario
)
GO
