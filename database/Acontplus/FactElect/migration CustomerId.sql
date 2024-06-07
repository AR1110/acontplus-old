use [Acontplus]
go




--select COUNT(*) from documentoElectronico

--select * from TipoDocumento where codigoSri is not null


UPDATE de WITH (ROWLOCK)
   SET de.customerId = CASE WHEN codDoc = '01' THEN (SELECT TOP 1 cl.CustomerId 
                                   FROM dbo.Factura fa
                                   INNER JOIN dbo.Cliente cl ON cl.idCliente = fa.idCliente
								   WHERE fa.idFactura = de.idDocumento)

							WHEN codDoc = '03' THEN (SELECT TOP 1 pr.CustomerId 
												   FROM LiquidacionCompra lc 
												   INNER JOIN dbo.Proveedor pr ON pr.idProveedor = lc.idProveedor
												   WHERE lc.idLiquidacionCompra = de.idDocumento)

							WHEN codDoc = '04' THEN (SELECT TOP 1 cl.CustomerId 
												   FROM dbo.NotaCredito nc
												   INNER JOIN dbo.Cliente cl ON cl.idCliente = nc.idCliente
												   WHERE nc.idNotaCredito = de.idDocumento)
			
							WHEN codDoc = '06' THEN (SELECT TOP 1 cl.CustomerId 
												   FROM dbo.GuiaRemision gr
												   INNER JOIN dbo.Cliente cl ON cl.idCliente = gr.idCliente
												   WHERE gr.idGuiaRemision = de.idDocumento)

							WHEN codDoc = '07' AND versionComp = '2.0.0' THEN (SELECT TOP 1 pr.CustomerId 
												   FROM FactElect.RetencionAts ra 
												   INNER JOIN dbo.Proveedor pr ON pr.idProveedor = ra.idProveedor
												   WHERE ra.idRetencionAts = de.idDocumento)

							WHEN codDoc = '07' AND versionComp = '1.0.0' THEN (SELECT TOP 1 pr.CustomerId 
												   FROM dbo.RetencionCompra rc
												   INNER JOIN dbo.Proveedor pr ON pr.idProveedor = rc.idProveedor
												   WHERE rc.idRetencionCompra = de.idDocumento)
			
				   
					END
    ,de.idEstadoServicio = (select TOP 1 es.idEstadoServicio from FactElect.EstadoServicio es WITH (NOLOCK) WHERE es.codigo = de.codEstado)
FROM DocumentoElectronico de