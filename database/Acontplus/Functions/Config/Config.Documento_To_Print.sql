USE [Acontplus]
go
-- ================================================
-- Template generated from Template Explorer using:
-- Create Multi-Statement Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>

-- =============================================
CREATE OR ALTER FUNCTION Config.Documento_To_Print
(
	-- Add the parameters for the function here
	@idDocument INT 
   ,@codDoc VARCHAR(5)
)
RETURNS 
@table TABLE 
(
	-- Add the column definitions for the TABLE variable here
	dataSources VARCHAR(MAX)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	DECLARE @header VARCHAR(MAX)
	DECLARE @detail VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)
	--DECLARE @formaPago VARCHAR(100)
    DECLARE @payments VARCHAR(MAX)
	--DECLARE @pago DECIMAL(15,2)
 --   DECLARE @cambio DECIMAL(15,2)
	
    IF @codDoc = 'FV' OR @codDoc = 'NE'
        BEGIN
         --SELECT TOP 1
		       --  @pago =  ci.total
		       -- ,@cambio = ci.cambio
		       -- ,@formaPago = ef.descripcion
	        --FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK) 
	        --INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
	        --INNER JOIN dbo.ComprobanteIngreso       ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
	        --INNER JOIN dbo.Cobro                     c WITH (NOLOCK) ON c.idComprobanteIngreso  = ci.idComprobanteIngreso
	        --INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
	        --WHERE cc.codDoc = IIF(@codDoc = 'FV','01','NE') 
         --     AND cc.idDocumento = @idDocument 
         --     AND ci.estado = 1

	       SET @payments = (SELECT CAST(ci.total AS numeric(18,2)) valor
                ,CAST(c.abono AS numeric(18,2)) abono
		        ,CAST(c.vuelto AS numeric(18,2)) cambio
                ,CAST(cc.importeTotal AS numeric(18,2)) total
		        ,ef.descripcion formaPago
                ,fp.codigo
	        FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK) 
	        INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
	        INNER JOIN dbo.ComprobanteIngreso       ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
	        INNER JOIN dbo.Cobro                     c WITH (NOLOCK) ON c.idComprobanteIngreso  = ci.idComprobanteIngreso
	        INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
            INNER JOIN dbo.FormaPagoSri fp WITH(NOLOCK) ON ef.idFormaPagoSri = fp.idFormaPagoSri
	        WHERE cc.codDoc = IIF(@codDoc = 'FV','01','NE') 
              AND cc.idDocumento = @idDocument 
              AND ci.estado = 1 FOR JSON PATH)
        END 

	IF @codDoc = 'FV'
		BEGIN
			SET @header = (
					        SELECT 
					             codDoc = 'FV'
						        ,nroDoc = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,f.nroFactura) 
						        ,nroFactura = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,f.nroFactura) 
						        ,labelNroDoc = 'FACTURA Nro. '
						        ,ambiente = IIF(pe.ambiente=2, 'PRODUCCIÓN', 'PRUEBAS')
						        ,emision = IIF(f.emision=1, 'NORMAL', '')
						        ,codigoAutorizacion = f.claveAcceso
						        ,fechaEmision = CONVERT(NVARCHAR, FORMAT(f.fechaEmision, 'dd/MM/yyyy hh:mm')) 
                                ,(SELECT TOP 1 CONVERT(NVARCHAR,FORMAT(cx.fechaVencimiento, 'dd/MM/yyyy')) FROM dbo.v_CuentaPorCobrar cx WITH (NOLOCK) WHERE cx.codDoc = '01' AND cx.idDocumento = f.idFactura) as fechaVencimiento 
						        ,tipoDoc = 'FACTURA DE VENTA'
						        ,razonSocial = e.razonSocial
						        ,nombreComercial = REPLACE(s.nombreComercial   , '&', '%26')   
						        ,ruc = e.ruc
						        ,telefonoEntidad = ISNULL(s.telefono , 'S/N')
						        ,emailEntidad = s.correo
						        ,dirMatriz = REPLACE(ISNULL(s.dirEstablecimiento, 'S/N'), '&', '%26') 
						        ,s.dirEstablecimiento
						        ,s.contribuyenteEspecial 
						        ,s.obligadoContabilidad
						        ,labelObligadoContabilidad = 'Obligado Contabilidad: ' + s.obligadoContabilidad
						        ,labelAgenteRetencion = ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+s.agenteRetencion,'') 
						        ,s.agenteRetencion 
						        ,razonSocialComprador = REPLACE(cl.nombreFiscal  , '&', '%26')  
						        ,nroIdentificacion = cl.numeroIdentificacion
						        ,direccionComprador = REPLACE(cl.direccion  , '&', '%26')  
                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '2' AND fi.[Percent] > 0 
                                ),0) 
                                as subTotalIva12

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '2' AND fi.codigoPorcentaje = '6' 
                                ),0) 
                                as subTotalNoObjetoIva

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '2' AND fi.codigoPorcentaje = '0' 
                                ),0) 
                                as subTotalIva0

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '2' AND fi.codigoPorcentaje = '7'
                                ),0) as subtotalExcentoIva

						        ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '3' 
                                ),0) as ice

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxBase)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '5' 
                                ),0) as irbpnr

						        ,subTotalSinImpuestos = CAST(f.subTotalSinImpuestos as numeric(15,2))
						        ,totalDescuentos = CAST(f.totalDescuento as numeric(15,2))
						        
                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(fi.TaxValue)as numeric(15,2)) FROM Ventas.v_FacturaImpuesto fi WITH (NOLOCK)
                                    WHERE fi.FacturaId = f.idFactura 
                                      AND fi.codigo = '2' 
                                ),0)  as iva12 

						        ,propina = CAST(f.propina as numeric(15,2))  
						        ,importeTotal = CAST(f.total as numeric(15,2)) 
						        ,direccion = cl.direccion  
						        ,telefonoCliente = cl.telefono 
						        ,email = cl.correo 
						        ,valorTotal = CAST(f.total as numeric(15,2))
						        ,regimen = UPPER(s.contribuyenteRimpe)
						        ,tipoIva = 'IVA 12' 
						        ,'SUBTOTAL 12% ' as porcentajeIva 
						        ,usuario = u.nombreUsuario
						        --,pago = ISNULL(@pago,0)
						        --,cambio = ISNULL(@cambio,0)
						        --,formaPago = IIF(@formaPago Is NULL,'Cobro:','Cobro:'+ SUBSTRING(@formaPago,0, 9))
              --                  ,@payments payments
					        FROM dbo.Factura f WITH (NOLOCK)
					        INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK)  ON pe.idPuntoEmision = f.idPuntoEmision 
					        INNER JOIN Sri.Establecimiento s  WITH (NOLOCK)  ON s.codEstab        = pe.codEstab
					        INNER JOIN dbo.Cliente         cl WITH (NOLOCK)  ON cl.idCliente      = f.idCliente
					        INNER JOIN dbo.Entidad         e  WITH (NOLOCK)  ON e.idEntidad       = f.idEntidad
					        INNER JOIN dbo.Usuario         u  WITH (NOLOCK)  ON u.idUsuario       = f.idUsuario 
					        WHERE f.idFactura = @idDocument 
					        FOR JSON PATH
				        )

		SET @detail = (
						SELECT 
							 codigo         = a.codigo 
							,descripcion    = REPLACE(fd.descripcion, '#', '%23')
							,medida         = me.descripcion
							,cantidad       = CAST(fd.cantidad as numeric(15,2))
							,precioUnitario = CAST(fd.precioUnitario as numeric(15,2))
							,valorDescuento = CAST(fd.valorDescuento as numeric(15,2)) 
							,precioTotal    = CAST(fd.precioTotalSinImpuesto as numeric(15,2))
						FROM dbo.FacturaDetalle fd WITH (NOLOCK)
						INNER JOIN dbo.Articulo a  WITH (NOLOCK) ON a.idArticulo = fd.idArticulo
						INNER JOIN dbo.Medida  me  WITH (NOLOCK) ON me.idMedida  = fd.idMedida
						WHERE fd.idFactura = @idDocument AND fd.estado = 1
						FOR JSON PATH
					  )

		END 


	IF @codDoc = 'NE'
		BEGIN
			SET @header = (SELECT 
							
							codDoc = 'NE'
							,nroDoc = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento)	
							,labelNroDoc = 'NOTA DE ENTREGA Nro. '  
							,tipoDoc = 'NOTA DE ENTREGA'
							,razonSocial = e.razonSocial
							,nombreComercial = REPLACE(s.nombreComercial   , '&', '%26')   
							,ruc = e.ruc
							,direccion = e.direccion 
                            ,dirMatriz = REPLACE(ISNULL(s.dirEstablecimiento, 'S/N'), '&', '%26') 
							,email = s.correo 
							,telefonoEntidad = ISNULL(s.telefono, 'SN') 
							,fechaEmision = CONVERT(NVARCHAR, FORMAT(ne.fechaEmision, 'dd/MM/yyyy hh:mm')) 
                            ,(SELECT TOP 1 CONVERT(NVARCHAR,FORMAT(cx.fechaVencimiento, 'dd/MM/yyyy')) FROM dbo.v_CuentaPorCobrar cx WITH (NOLOCK) WHERE cx.codDoc = 'NE' AND cx.idDocumento = ne.idNotaEntrega) as fechaVencimiento 
							
							,s.dirEstablecimiento  
							,s.contribuyenteEspecial
						    ,s.obligadoContabilidad

							,cliente = REPLACE(cl.nombreFiscal   , '&', '%26')  
							,nroIdentificacion = cl.numeroIdentificacion
							,direccionCliente = REPLACE(cl.direccion   , '&', '%26')  
							,correoCliente = REPLACE(ISNULL(cl.correo , 'S/N'),';',',')
							,telefonoCliente = REPLACE(ISNULL(cl.telefono, 'S/N'),';',',')
							,ciudad = c.descripcion 
							
                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '2' AND ni.[Percent] > 0 
                            ),0) 
                            as subTotalIva12

                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '2' AND ni.codigoPorcentaje = '6' 
                            ),0) 
                            as subTotalNoObjetoIva

                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '2' AND ni.codigoPorcentaje = '0' 
                            ),0) 
                            as subTotalIva0

                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '2' AND ni.codigoPorcentaje = '7' 
                            ),0) 
                            as subtotalExcentoIva

                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '3' 
                            ),0) 
                            as ice

                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxBase)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '5' 
                            ),0) 
                            as irbpnr

							,subTotalSinImpuestos = CAST(ne.subTotalSinImpuestos as numeric(15,2))
							,totalDescuentos = CAST(ne.totalDescuento as numeric(15,2))
							
                            ,ISNULL
                            ((
                                SELECT CAST(SUM(ni.TaxValue)as numeric(15,2)) FROM Ventas.v_NotaEntregaImpuesto ni WITH (NOLOCK)
                                WHERE ni.NotaEntregaId = ne.idNotaEntrega 
                                    AND ni.codigo = '2' 
                            ),0) 
                            as iva12

							
                            ,propina = CAST(ne.propina AS numeric(15,2)) 
							,importeTotal = CAST(ne.total as numeric(15,2))		
							,valorTotal = CAST(ne.total as numeric(15,2))
							,observacion = ISNULL(ne.observacion, 'S/N') 
							,tipoIva = 'IVA 12'
							,'subTotal 12 %' as porcentajeIva
							,usuario = u.nombreUsuario
							--,pago = ISNULL(@pago,0)
							--,cambio = ISNULL(@cambio,0)
						 --   ,formaPago = IIF(@formaPago Is NULL,'Cobro:','Cobro:'+ SUBSTRING(@formaPago,0, 9))
       --                     ,@payments payments
						FROM dbo.NotaEntrega ne WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision 
						INNER JOIN Sri.Establecimiento  s WITH (NOLOCK) ON s.codEstab        = pe.codEstab
						INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
						LEFT  JOIN dbo.Ciudad           c WITH (NOLOCK) ON c.idCiudad        = cl.idCiudad 
						INNER JOIN dbo.Entidad          e WITH (NOLOCK) ON e.idEntidad       = ne.idEntidad
						INNER JOIN dbo.Usuario          u WITH (NOLOCK) ON u.idUsuario	     = ne.idUsuario
						WHERE ne.idNotaEntrega = @idDocument FOR JSON PATH )

			SET @detail = (SELECT 
							 codigo         = a.codigo
							,cantidad       = CAST(ned.cantidad AS numeric(15,2))
							,descripcion    = REPLACE(ned.descripcion, '#', '%23')
							,precioUnitario = CAST(ned.precioUnitario AS numeric(15,2))
							,valorDescuento = CAST(ned.valorDescuento AS numeric(15,2))
							,precioTotal    = CAST(ned.precioTotalSinImpuesto AS numeric(15,2)) 
							,medida = m.descripcion
						FROM dbo.NotaEntregaDetalle ned WITH (NOLOCK)
						INNER JOIN dbo.Medida   m WITH (NOLOCK) ON m.idMedida   = ned.idMedida
						INNER JOIN dbo.Articulo a WITH (NOLOCK) ON a.idArticulo = ned.idArticulo 
						WHERE ned.idNotaEntrega = @idDocument AND ned.estado = 1 FOR JSON PATH)
		END 

	IF @codDoc ='PR'
		BEGIN 
			SET @header = (SELECT 
								 
								 codDoc = 'PR'
								,idProforma = pr.idProforma
								,nroDoc = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,pr.nroDocumento) 
								,labelNroDoc = 'PROFORMA Nro. '  
								,tipoDoc = UPPER(td.descripcion)+':'
								,fechaEmision = dbo.AFTConvertDate(pr.fechaEmision)+dbo.AFTConvertHora(pr.fechaEmision)
								,razonSocial = LTRIM(RTRIM(e.razonSocial)) 
								,nombreComercial = REPLACE(s.nombreComercial   , '&', '%26')   
								,ruc = e.ruc
								,direccionEntidad = e.direccion
                                ,dirMatriz = REPLACE(ISNULL(s.dirEstablecimiento, 'S/N'), '&', '%26') 
								,telefonoEntidad = ISNULL(s.telefono, 'S/N')  
								,emailEntidad = s.correo 	
								,razonSocialCliente = REPLACE(cl.nombreFiscal   , '&', '%26')   
								,nroIdentificacion = cl.numeroIdentificacion 
								,direccionCliente = REPLACE(ISNULL(cl.direccion, ''), '&', '%26')   
								,correoCliente = ISNULL(cl.correo, '')

								,s.dirEstablecimiento
								,s.contribuyenteEspecial 
						        ,s.obligadoContabilidad
								,labelObligadoContabilidad = 'Obligado Contabilidad: ' + s.obligadoContabilidad
								,labelAgenteRetencion = ISNULL('AGENTE DE RETENCION RESOLUCION NRO: '+s.agenteRetencion,'') 
								,s.agenteRetencion
								,regimen = UPPER(s.contribuyenteRimpe)
								,telefonoCliente = ISNULL(cl.telefono, '')
								,ciudadCliente = ISNULL(c.descripcion, 'S/N')

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxBase)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                        AND pm.codigo = '2' AND pm.[Percent] > 0 
                                ),0) 
                                as subTotalIva12

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxBase)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                        AND pm.codigo = '2' AND pm.codigoPorcentaje = '6' 
                                ),0) 
                                as subTotalNoObjetoIva

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxBase)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                        AND pm.codigo = '2' AND pm.codigoPorcentaje = '0' 
                                ),0) 
                                as subTotalIva0

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxBase)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                        AND pm.codigo = '2' AND pm.codigoPorcentaje = '7' 
                                ),0) 
                                as subtotalExcentoIva

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxValue)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                      AND pm.codigo = '3'
                                ),0) 
                                as ice

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxValue)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                      AND pm.codigo = '5'
                                ),0) 
                                as irbpnr

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(pm.TaxValue)as numeric(15,2)) FROM Ventas.v_ProformaImpuesto pm WITH (NOLOCK)
                                    WHERE pm.ProformaId = pr.idProforma 
                                      AND pm.codigo = '2'
                                ),0) 
                                as iva12
 
								,subTotalSinImpuestos = CAST(pr.subTotalSinImpuestos AS numeric(15,2)) 
								,totalDescuentos = CAST(pr.totalDescuento AS numeric(15,2))
								,propina = CAST(pr.propina AS numeric(15,2))  
								,importeTotal = CAST(pr.total AS numeric(15,2))
								,valorTotal = CAST(pr.total AS numeric(15,2))
								,observacion = ISNULL(UPPER(pr.observacion), '')		
								,porcentajeIva = 'SUBTOTAL IVA 12%'
								,tipoIva = 'IVA 12%'
							FROM dbo.Proforma pr
							INNER JOIN dbo.PuntoEmision       pe  ON pe.idPuntoEmision       = pr.idPuntoEmision 
							INNER JOIN Sri.Establecimiento    s   ON s.codEstab              = pe.codEstab
							INNER JOIN dbo.TipoDocumento      td  ON td.idTipoDocumento      = pr.idTipoDocumento
							INNER JOIN dbo.Cliente            cl  ON cl.idCliente            = pr.idCliente
							INNER JOIN dbo.TipoIdentificacion ti  ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
							 LEFT JOIN dbo.Ciudad             c   ON c.idCiudad              = cl.idCiudad
							INNER JOIN dbo.Entidad            e   ON e.idEntidad             = pr.idEntidad
							WHERE pr.idProforma = @idDocument FOR JSON PATH  
						)

			 SET @detail = (SELECT 
								 codigo = a.codigo
								,cantidad = CAST(prd.cantidad as numeric(15,2)) 
								,descripcion = REPLACE(prd.descripcion, '#', '%23')
								,precioUnitario = CAST(prd.precioUnitario as numeric(15,2))
								,precioTotal = CAST(prd.precioTotalSinImpuesto as numeric(15,2))
								,valorDescuento =  CAST(prd.valorDescuento as numeric(15,2)) 
								,medida = m.descripcion
							FROM dbo.ProformaDetalle prd
							LEFT JOIN dbo.Medida   m ON m.idMedida   = prd.idMedida
							INNER JOIN dbo.Articulo a ON a.idArticulo = prd.idArticulo 
							WHERE prd.idProforma = @idDocument --AND prd.estado = 1 
							FOR JSON PATH)
		END 


	IF @codDoc = 'IC' OR @codDoc = 'EC'
		BEGIN 
			SET @header = (	
							SELECT 
								 
								 mc.razonSocial
								,mc.ruc
								,mc.establecimiento
								,dirMatriz = mc.dirEstablecimiento
								,fechaEmision =  CONVERT(NVARCHAR, FORMAT(mc.fechaEmision, 'dd/MM/yyyy hh:mm')) 						
								,nroDoc= UPPER(mc.tipoDoc) + ' : ' + mc.codDoc + '-'+ mc.estab+ '-'+ dbo.AFTAutoComplete(mc.nroDoc)
								--,mc.entregadoPor
								-- mc.recibidoPor
								,mc.tipoDoc
								,mc.nroIdentificacion
								,labelEmpleado = IIF(mc.codDoc='IC', 'Recib. por: ', 'Entrg. por: ') 
								,empleado =  mc.empleado
								,entidadFinanciera = UPPER(mc.entidadFinanciera)
								,valorTotal = convert(numeric(18,2), mc.valor)
								,observacion = UPPER(mc.observacion)
								,usuario	
							FROM v_movimiento_caja mc
							WHERE idMovimientoCaja = @idDocument
							FOR JSON PATH
				
			)
		END 

	IF @codDoc = 'A'
		BEGIN
			SET @header = (	
							SELECT 
								a.entidad
								,a.establecimiento
								,a.ruc
								,dirMatriz = a.dirEstablecimiento
								,a.idAnticipo
								,nroDocumento = a.estab+ '-'+ dbo.AFTAutoComplete(a.nroDoc)
								,fechaEmision = CONVERT(NVARCHAR, FORMAT(a.fechaEmision, 'dd/MM/yyyy hh:mm')) 
								,valorTotal = CAST(a.valor AS numeric(18,2))
								,observacion = a.observaciones
								,identificacionComprador = a.numeroIdentificacion
								,a.cliente
								,a.direccionCliente
								,a.telefonoCliente
								,a.entidadFinanciera 
								,a.estadoDoc  
								,a.codDoc 
								,usuario = a.nombreUsuario
							FROM v_Anticipo a
							WHERE a.idAnticipo = @idDocument
							FOR JSON PATH
				
			)
		END 
 

	SET @dataSources = (SELECT encabezadoDs = @header, detalleDs = @detail, paymentsDs = ISNULL(@payments, '[]') FOR JSON PATH )

	INSERT INTO @table (dataSources) SELECT @dataSources
	RETURN 
END
GO