USE Acontplus
GO 
CREATE OR ALTER VIEW FactElect.v_DocElectronico WITH SCHEMABINDING AS (
    SELECT de.idDocumentoElectronico
          ,de.idEntidad
          ,de.isAutomatic
          ,de.idUsuario
          ,en.razonSocial entidad
          ,de.CustomerId
          ,en.ruc
          ,pe.ambiente as codAmbiente
          ,CASE WHEN pe.ambiente = '2' THEN 'PRODUCCIÓN' ELSE 'PRUEBAS' END                                as ambiente
          ,de.codDoc
          ,de.idDocumento
          ,de.versionComp
          ,CASE WHEN de.codDoc = '01' THEN 'Factura' 
                WHEN de.codDoc = '03' THEN 'Liquidación de Compras' 
                WHEN de.codDoc = '04' THEN 'Nota de Crédito' 
                WHEN de.codDoc = '05' THEN 'Nota de Débito' 
                WHEN de.codDoc = '06' THEN 'Guía de Remisión' 
                WHEN de.codDoc = '07' THEN 'Comprobante de Retención'
           END                                                                                            as comprobante
          ,se.codEstab
          ,se.estab
          ,pe.ptoEmi
          ,de.nroDocumento secuencial
          ,se.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(de.nroDocumento AS VARCHAR(9)), 9) as serieComprobante
          ,de.fechaEmision
          ,de.xmlAcontPlus
          ,CONVERT(XML, DECOMPRESS(de.xmlCompressed))                                                     as xmlSri
          ,de.claveAcceso                                                                                 as codigoAutorizacion
          ,de.fechaAutorizacion
          ,de.claveAcceso
          ,cs.BusinessName razonSocial 
          ,cs.IDCard rucReceptor
          ,es.idEstadoServicio
          ,es.codigo AS codEstado
          ,es.descripcion estado
          ,de.fechaRegistro
          ,de.idPuntoEmision
          ,ISNULL(se.telefono, '') as telefonoEstablecimiento
          ,se.nombreComercial
          ,us.nombreUsuario as usuario
          ,se.idEstablecimiento
    FROM dbo.DocumentoElectronico       de WITH (NOLOCK)
    INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad        = de.idEntidad  
    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision   = de.idPuntoEmision
     LEFT JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario        = de.idUsuario
     LEFT JOIN Sri.Establecimiento      se WITH (NOLOCK) ON pe.codEstab         = se.codEstab
     LEFT JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON de.idEstadoServicio = es.idEstadoServicio
     LEFT JOIN Customer.Customer        cs WITH (NOLOCK) ON cs.Id               = de.customerId 
)
GO
