use [Acontplus]
go




--select COUNT(*) from documentoElectronico WHERE customerId IS NULL

--select COUNT(*) from documentoElectronico WHERE idEstadoServicio IS NULL

--select * from TipoDocumento where codigoSri is not null


UPDATE de WITH (ROWLOCK)
   SET de.customerId = CASE WHEN codDoc = '01' THEN (SELECT TOP 1 cl.CustomerId 
                                                    FROM dbo.Factura       fa WITH (NOLOCK)
                                                    INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = fa.idCliente
								                    WHERE fa.idFactura = de.idDocumento)

							WHEN codDoc = '03' THEN (SELECT TOP 1 pr.CustomerId 
												     FROM LiquidacionCompra   lc WITH (NOLOCK) 
												     INNER JOIN dbo.Proveedor pr WITH (NOLOCK) ON pr.idProveedor = lc.idProveedor
												     WHERE lc.idLiquidacionCompra = de.idDocumento)

							WHEN codDoc = '04' THEN (SELECT TOP 1 cl.CustomerId 
												     FROM dbo.NotaCredito   nc WITH (NOLOCK)
												     INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = nc.idCliente
												     WHERE nc.idNotaCredito = de.idDocumento)
			
							WHEN codDoc = '06' THEN (SELECT TOP 1 cl.CustomerId 
												     FROM dbo.GuiaRemision  gr WITH (NOLOCK)
												     INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = gr.idCliente
												     WHERE gr.idGuiaRemision = de.idDocumento)

							WHEN codDoc = '07' AND versionComp = '2.0.0' THEN (SELECT TOP 1 pr.CustomerId 
												                               FROM FactElect.RetencionAts ra WITH (NOLOCK) 
												                               INNER JOIN dbo.Proveedor    pr WITH (NOLOCK) ON pr.idProveedor = ra.idProveedor
												                               WHERE ra.idRetencionAts = de.idDocumento)

							WHEN codDoc = '07' AND versionComp = '1.0.0' THEN (SELECT TOP 1 pr.CustomerId 
												                               FROM dbo.RetencionCompra rc WITH (NOLOCK)
												                               INNER JOIN dbo.Proveedor pr WITH (NOLOCK) ON pr.idProveedor = rc.idProveedor
												                               WHERE rc.idRetencionCompra = de.idDocumento)
			
				   
					END
    ,de.idEstadoServicio = (select TOP 1 es.idEstadoServicio from FactElect.EstadoServicio es WITH (NOLOCK) WHERE es.codigo = de.codEstado)
FROM DocumentoElectronico de
WHERE de.customerId IS NULL