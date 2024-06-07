USE Acontplus
GO 
CREATE OR ALTER VIEW FactElect.v_DocElectronico WITH SCHEMABINDING AS (
    SELECT de.idDocumentoElectronico
          ,e.idEntidad
          ,e.razonSocial entidad
          ,e.ruc
          ,pe.ambiente as codAmbiente
          ,ambiente = CASE WHEN pe.ambiente = 2 THEN 'PRODUCCIÓN' ELSE 'PRUEBAS' END
          ,de.codDoc
          ,de.idDocumento
          ,de.versionComp
          ,comprobante = CASE 
                            WHEN de.codDoc = '01' THEN 'Factura' 
                            WHEN de.codDoc = '03' THEN 'Liquidación de Compras' 
                            WHEN de.codDoc = '04' THEN 'Nota de Crédito' 
                            WHEN de.codDoc = '05' THEN 'Nota de Débito' 
                            WHEN de.codDoc = '06' THEN 'Guía de Remisión' 
                            WHEN de.codDoc = '07' THEN 'Comprobante de Retención'
                         END
          ,se.codEstab
          ,se.estab
          ,pe.ptoEmi
          ,de.nroDocumento secuencial
          ,se.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(de.nroDocumento AS VARCHAR(9)), 9) serieComprobante
          ,de.fechaEmision
          ,de.xmlAcontPlus
          ,CONVERT(XML, DECOMPRESS(de.xmlCompressed)) xmlSri
          ,de.claveAcceso codigoAutorizacion
          ,de.fechaAutorizacion
          ,de.claveAcceso
          ,telefono = CASE 
                        WHEN de.codDoc = '01' THEN (SELECT TOP 1 LTRIM(RTRIM(c.telefono)) 
                                                    FROM dbo.Cliente c WITH(NOLOCK)
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                    WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad) 
                        WHEN de.codDoc = '03' THEN (SELECT TOP 1 LTRIM(RTRIM(p.telefono)) 
                                                    FROM dbo.Proveedor p WITH(NOLOCK) 
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON p.CustomerId = cc.Id  
                                                    WHERE p.CustomerId = de.customerId AND p.idEntidad = de.idEntidad)
                        WHEN de.codDoc = '04' THEN (SELECT TOP 1 LTRIM(RTRIM(c.telefono)) 
                                                    FROM dbo.Cliente c WITH(NOLOCK)
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                    WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                        WHEN de.codDoc = '05' THEN (SELECT TOP 1 LTRIM(RTRIM(c.telefono)) 
                                                    FROM dbo.Cliente c WITH(NOLOCK)
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                    WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                        WHEN de.codDoc = '06' THEN (SELECT TOP 1 LTRIM(RTRIM(c.telefono)) 
                                                    FROM dbo.Cliente c WITH(NOLOCK)
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                    WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                        WHEN de.codDoc = '07' THEN (SELECT TOP 1 LTRIM(RTRIM(p.telefono)) 
                                                    FROM dbo.Proveedor p WITH(NOLOCK) 
                                                    INNER JOIN Customer.Customer cc WITH (NOLOCK) ON p.CustomerId = cc.Id  
                                                    WHERE p.CustomerId = de.customerId AND p.idEntidad = de.idEntidad)
                      END
         ,c.BusinessName razonSocial 
         ,c.IDCard rucReceptor
         ,correo = CASE 
                      WHEN de.codDoc = '01' THEN (SELECT TOP 1 c.correo 
                                                  FROM dbo.Cliente c WITH(NOLOCK)
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                  WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                      WHEN de.codDoc = '03' THEN (SELECT TOP 1 p.correo 
                                                  FROM dbo.Proveedor p WITH(NOLOCK) 
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON p.CustomerId = cc.Id  
                                                  WHERE p.CustomerId = de.customerId AND p.idEntidad = de.idEntidad)
                      WHEN de.codDoc = '04' THEN (SELECT TOP 1 c.correo 
                                                  FROM dbo.Cliente c WITH(NOLOCK)
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                  WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                      WHEN de.codDoc = '05' THEN (SELECT TOP 1 c.correo 
                                                  FROM dbo.Cliente c WITH(NOLOCK)
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                  WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                      WHEN de.codDoc = '06' THEN (SELECT TOP 1 c.correo 
                                                  FROM dbo.Cliente c WITH(NOLOCK)
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id  
                                                  WHERE c.CustomerId = de.customerId AND c.idEntidad = de.idEntidad)
                      WHEN de.codDoc = '07' THEN (SELECT TOP 1 p.correo 
                                                  FROM dbo.Proveedor p WITH(NOLOCK) 
                                                  INNER JOIN Customer.Customer cc WITH (NOLOCK) ON p.CustomerId = cc.Id  
                                                  WHERE p.CustomerId = de.customerId AND p.idEntidad = de.idEntidad)
                   END
         ,es.codigo codEstado
         ,es.descripcion estado
         ,de.fechaRegistro
         ,de.idUsuario
         ,de.idPuntoEmision
         ,ISNULL(se.telefono, '') as telefonoEstablecimiento
         ,se.nombreComercial
         ,us.nombreUsuario as usuario
         ,de.isAutomatic
         ,se.idEstablecimiento
    FROM dbo.DocumentoElectronico de WITH (NOLOCK)
    INNER JOIN dbo.Entidad e WITH (NOLOCK) ON de.idEntidad = e.idEntidad
    INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = de.idPuntoEmision
    LEFT JOIN dbo.Usuario us WITH (NOLOCK) ON us.idUsuario = de.idUsuario
    LEFT JOIN Sri.Establecimiento se WITH (NOLOCK) ON pe.codEstab = se.codEstab
    LEFT JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON de.idEstadoServicio = es.idEstadoServicio
    LEFT JOIN Customer.Customer c WITH (NOLOCK) ON de.customerId = c.Id
)
GO
