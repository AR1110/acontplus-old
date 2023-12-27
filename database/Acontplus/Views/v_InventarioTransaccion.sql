USE AcontPlus
GO
IF OBJECT_ID(N'v_InventarioTransaccion', N'V') IS NOT NULL
DROP VIEW v_InventarioTransaccion
GO
CREATE VIEW v_InventarioTransaccion WITH SCHEMABINDING AS (
SELECT t.idTransaccion
	,t.idTipoTransaccion
	,t.idArticulo
	,t.idBodega
	,t.idTipoDocumento
	,t.idDocumento
	,t.idTarifa
	,t.cantidad
	,t.precioUnitario
	,t.precioCosto
	,t.fechaRegistro
	,t.estado
	,t.idUsuario
	,tt.codigo codTransaccion
	,tt.descripcion transaccion
	,td.codigo codDoc
	,td.codigoSri
	,td.descripcion documento
	,b.codEstab
	,b.descripcion bodega
	,a.idEntidad
	,a.codigo codArticulo
	,a.codigoAuxiliar
	,a.codigoBarra
	,a.descripcion articulo
	,ISNULL(CASE WHEN tt.codigo = 'E' OR tt.codigo = 'A' THEN t.cantidad END, 0) cantidadEntrada
	,ISNULL(CASE WHEN tt.codigo = 'S' THEN t.cantidad END, 0) cantidadSalida
	,u.nombreUsuario usuario
	,nroDocumento = (
		CASE 
			
			WHEN tt.codigo = 'E' AND td.codigo = 'LC'
				THEN (
						SELECT TOP 1 es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
						FROM dbo.LiquidacionCompra     lc WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = lc.idPuntoEmision
						INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
						WHERE lc.idLiquidacionCompra = t.idDocumento
					 )

			WHEN tt.codigo = 'E' AND td.codigo = 'FE'
				THEN (
						SELECT TOP 1 serieComprobante
						FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
						WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'FF'
				THEN (
						SELECT TOP 1  puntoEmision + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
						FROM dbo.FacturaCompra fc  WITH (NOLOCK)
						WHERE fc.idFacturaCompra = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'NC'
				THEN (
							SELECT TOP 1 dr.serieComprobante
							FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
							WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'IV'
				   THEN(
						SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, secuencial), 9)
						FROM Compra.Documento_Ingreso di  WITH (NOLOCK)
                        INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON di.idPuntoEmision = pe.idPuntoEmision
						INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
						WHERE di.idDocumentoIngreso = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'FE'
				THEN (
						SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, f.nroFactura), 9)
						FROM dbo.Factura                   f WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON f.idPuntoEmision = pe.idPuntoEmision
						INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
						WHERE f.idFactura = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo IN ('NE', 'OR')
				THEN (
						SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
						FROM dbo.NotaEntrega              ne WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON ne.idPuntoEmision = pe.idPuntoEmision
						INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
						WHERE ne.idNotaEntrega = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'NC'
				THEN (
						SELECT TOP 1 estab + '-' + ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
						FROM dbo.NotaCredito              nc WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON nc.idPuntoEmision = pe.idPuntoEmision
						INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
						WHERE nc.idNotaCredito = t.idDocumento
						
						)
			WHEN tt.codigo = 'A' AND td.codigo = 'CI'
				THEN 
				(
					SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDoc), 9)
					FROM dbo.ConsolidacionInventario  dr  WITH (NOLOCK)
					INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON dr.idPuntoEmision = pe.idPuntoEmision
					INNER JOIN Sri.Establecimiento e  WITH (NOLOCK) ON pe.codEstab = e.codEstab
					WHERE dr.idConsolidacionInventario = t.idDocumento
				)
			END
		)

	,clienteProveedor = (
		CASE 
			WHEN tt.codigo = 'E' AND td.codigo = 'FE'
				THEN	(
						SELECT TOP 1 dr.razonSocialEmisior
						FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
						WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'FF'
				THEN	(
						SELECT TOP 1  p.nombreFiscal
						FROM dbo.FacturaCompra fc  WITH (NOLOCK)
						INNER JOIN dbo.Proveedor p  WITH (NOLOCK) ON fc.idProveedor = p.idProveedor
						WHERE fc.idFacturaCompra = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'NC'
				THEN	(
						SELECT TOP 1 dr.razonSocialEmisior
						FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
						WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'IV'
				THEN	(
						SELECT TOP 1 p.nombreFiscal
						FROM Compra.Documento_Ingreso di  WITH (NOLOCK)
						INNER JOIN dbo.Proveedor p  WITH (NOLOCK) ON di.idProveedor = p.idProveedor
						WHERE di.idDocumentoIngreso = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'FE'
				THEN    (
						SELECT TOP 1 c.nombreFiscal
						FROM dbo.Factura f  WITH (NOLOCK)
						INNER JOIN dbo.Cliente c  WITH (NOLOCK) On f.idCliente = c.idCliente 
						WHERE f.idFactura = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo IN ('NE', 'OR')
				THEN	(
						SELECT TOP 1 c.nombreFiscal
						FROM dbo.NotaEntrega ne  WITH (NOLOCK)
						INNER JOIN dbo.Cliente c  WITH (NOLOCK) On ne.idCliente = c.idCliente
						WHERE ne.idNotaEntrega = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'NC'
				THEN	(
						SELECT TOP 1 c.nombreFiscal
						FROM dbo.NotaCredito nc  WITH (NOLOCK)  
						INNER JOIN dbo.Cliente c  WITH (NOLOCK) On nc.idCliente = c.idCliente
						WHERE nc.idNotaCredito = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'LC'
				THEN	(
						SELECT TOP 1 pr.nombreFiscal
						FROM dbo.LiquidacionCompra lc  WITH (NOLOCK)
						INNER JOIN dbo.Proveedor pr  WITH (NOLOCK) ON pr.idProveedor = lc.idProveedor 
						WHERE lc.idLiquidacionCompra = t.idDocumento
						)
				END
		)
,rucClienteProveedor = (
		CASE 
			WHEN tt.codigo = 'E' AND td.codigo = 'FE'
				THEN   (
						SELECT TOP 1 dr.rucEmisor
						FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
						WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'FF'
				THEN    (
						SELECT TOP 1  p.numeroIdentificacion
						FROM dbo.FacturaCompra fc  WITH (NOLOCK)
						INNER JOIN dbo.Proveedor p  WITH (NOLOCK) ON fc.idProveedor = p.idProveedor
						WHERE fc.idFacturaCompra = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'NC'
				THEN   (
						SELECT TOP 1 dr.rucEmisor
						FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
						WHERE dr.idDocumento = t.idDocumento
						)
			WHEN tt.codigo = 'E' AND td.codigo = 'IV'
				THEN    (
						SELECT TOP 1 p.numeroIdentificacion
						FROM Compra.Documento_Ingreso di  WITH (NOLOCK)
						INNER JOIN dbo.Proveedor p  WITH (NOLOCK) ON di.idProveedor = p.idProveedor
						WHERE di.idDocumentoIngreso = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'FE'
				THEN    (
						SELECT TOP 1 c.numeroIdentificacion
						FROM dbo.Factura f  WITH (NOLOCK)
						INNER JOIN dbo.Cliente c  WITH (NOLOCK) On f.idCliente = c.idCliente 
						WHERE f.idFactura = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo IN ('NE', 'OR')
				THEN    (
						SELECT TOP 1 c.numeroIdentificacion
						FROM dbo.NotaEntrega ne  WITH (NOLOCK)
						INNER JOIN dbo.Cliente c On ne.idCliente = c.idCliente
						WHERE ne.idNotaEntrega = t.idDocumento
						)
			WHEN tt.codigo = 'S' AND td.codigo = 'NC'
				THEN	(
						SELECT TOP 1 c.numeroIdentificacion
						FROM dbo.NotaCredito nc  WITH (NOLOCK)
						INNER JOIN dbo.Cliente c  WITH (NOLOCK) On nc.idCliente = c.idCliente
						WHERE nc.idNotaCredito = t.idDocumento
						)
				
			WHEN tt.codigo = 'E' AND td.codigo = 'LC'
				THEN (
					SELECT TOP 1 pr.numeroIdentificacion
					FROM dbo.LiquidacionCompra lc  WITH (NOLOCK)
					INNER JOIN dbo.Proveedor pr  WITH (NOLOCK) ON pr.idProveedor = lc.idProveedor 
					WHERE lc.idLiquidacionCompra = t.idDocumento
					 )
				END
		)
,ISNULL(CASE WHEN tt.codigo = 'E' OR tt.codigo = 'A' THEN m.descripcion END, '') medidaEntrada
,ISNULL(CASE WHEN tt.codigo = 'S' THEN m.descripcion END, '') medidaSalida
,ISNULL(CASE WHEN tt.codigo = 'E' OR tt.codigo = 'A' THEN t.total END, 0) totalEntrada
,ISNULL(CASE WHEN tt.codigo = 'S' THEN t.total END, 0) totalSalida 
--,IIF(td.codigo = 'CI', t.idDocumento, dbo.AFTMovimientoKardex(t.fechaRegistro, t.idArticulo, t.idBodega)) particion
,CASE WHEN td.codigo = 'CI' THEN t.idDocumento ELSE
(SELECT max(ci.idConsolidacionInventario) 
								    FROM dbo.ConsolidacionInventario ci  WITH (NOLOCK)
									INNER JOIN dbo.ConsolidacionInventarioDetalle cid  WITH (NOLOCK) ON cid.idConsolidacionInventario = ci.idConsolidacionInventario
									INNER JOIN dbo.EstadoPago ep  WITH (NOLOCK) ON ep.idEstadoPago  = ci.idEstadoDocumento
									WHERE  ci.fechaEmision < t.fechaRegistro AND cid.idArticulo = t.idArticulo AND ep.codigo = 'AC' AND cid.idBodega = t.idBodega)
END particion
--,SUM(IIF(tt.codigo = 'S', -1, 1) * IIF(t.estado = 0, 0, t.cantidad)) OVER (PARTITION BY IIF(td.codigo = 'CI', t.idDocumento, dbo.AFTMovimientoKardex(t.fechaRegistro, t.idArticulo, t.idBodega)) ORDER BY t.fechaRegistro, t.idTransaccion ASC) saldo
,e.nombreComercial establecimiento
,tarifa = ta.descripcion
FROM Inventario.Transaccion            t WITH (NOLOCK)
INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON t.idTipoTransaccion = tt.idTipoTransaccion
INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON t.idTipoDocumento   = td.idTipoDocumento
INNER JOIN dbo.Bodega                  b WITH (NOLOCK) ON t.idBodega          = b.idBodega
INNER JOIN Sri.Establecimiento         e WITH (NOLOCK) ON b.codEstab          = e.codEstab
INNER JOIN dbo.Articulo                a WITH (NOLOCK) ON t.idArticulo        = a.idArticulo
 LEFT JOIN dbo.Medida                  m WITH (NOLOCK) ON a.idMedida          = m.idMedida
 LEFT JOIN dbo.Usuario                 u WITH (NOLOCK) ON t.idUsuario         = u.idUsuario
 LEFT JOIN dbo.Tarifa                 ta WITH (NOLOCK) ON ta.idTarifa         = t.idTarifa
)
