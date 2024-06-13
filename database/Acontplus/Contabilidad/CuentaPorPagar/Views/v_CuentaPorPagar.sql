USE AcontPlus
GO

CREATE OR ALTER VIEW v_CuentaPorPagar WITH SCHEMABINDING AS (
	SELECT cp.idCuentaPorPagar
	      ,cp.idProveedor
		  ,cp.idTiempoCredito
		  ,cp.idEstadoPago
		  ,cp.idUsuario
		  ,cp.idEntidad
		  ,cp.idDocumento
          ,CASE WHEN cp.codDoc = '03' THEN (SELECT TOP 1 lc.idPuntoEmision FROM dbo.LiquidacionCompra lc WITH (NOLOCK) WHERE lc.idLiquidacionCompra = cp.idDocumento)
                WHEN cp.codDoc = 'DH' THEN (SELECT TOP 1 di.idPuntoEmision FROM Compra.Documento_Ingreso di WITH (NOLOCK) WHERE di.idDocumentoIngreso = cp.idDocumento)
           END as idPuntoEmision
		  ,es.idEstablecimiento
          ,es.nombreComercial
          ,es.codEstab
		  ,cp.codDoc
		  ,cp.uniqueId
		  ,razonSocialProveedor = pr.nombreFiscal
		  ,identificacionProveedor = pr.numeroIdentificacion
          ,pr.CustomerId
		  ,cp.serieComprobante
		  ,secuencial = REPLACE(LTRIM(REPLACE(SUBSTRING(cp.serieComprobante,9,9),'0',' ')),' ','0')
		  ,cp.fechaEmision
		  ,cp.fechaVencimiento
		  ,cp.importeTotal
		  ,cp.abono
		  ,cp.saldo
		  ,estado                  = ep.descripcion
		  ,codEstado               = ep.codigo
		  ,estadoSri               = CASE WHEN cp.codDoc = '03' THEN (
                                                                          SELECT TOP 1 es.codigo 
                                                                          FROM dbo.DocumentoElectronico       de WITH (NOLOCK)
                                                                          INNER JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON es.idEstadoServicio = de.idEstadoServicio 
                                                                          WHERE de.idDocumento = cp.idDocumento 
                                                                            AND de.codDoc = '03'
                                                                     ) 
		                                                        ELSE 0 END 
		  ,usuario = us.nombreUsuario
          ,tc.descripcion as tiempoCredito
          ,tc.diasCredito
          ,cp.subcategoryId
          ,sc.[Name] subcategoryName
          ,(
                CASE cp.codDoc WHEN '01' THEN cp.uniqueId
                               WHEN 'FC' THEN (SELECT TOP 1 fc.nroAutorizacion FROM dbo.FacturaCompra fc WITH (NOLOCK) WHERE fc.idFacturaCompra = cp.idDocumento)
                END 
           ) as numAutDocSustento
	FROM Contabilidad.CuentaPorPagar    cp WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = cp.idEstablecimiento 
	INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor       = cp.idProveedor
	INNER JOIN dbo.EstadoPago           ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
	INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario         = cp.idUsuario
     LEFT JOIN dbo.TiempoCredito        tc WITH (NOLOCK) ON tc.idTiempoCredito   = cp.idTiempoCredito
     LEFT JOIN Contabilidad.Subcategory sc WITH (NOLOCK) ON sc.Id                = cp.SubcategoryId 
)