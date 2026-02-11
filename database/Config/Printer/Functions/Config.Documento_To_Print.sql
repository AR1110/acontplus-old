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
    DECLARE @payments VARCHAR(MAX)
    DECLARE @taxesValue VARCHAR(MAX)
    DECLARE @taxes VARCHAR(MAX)
    DECLARE @fechaEmision DATETIME2
    DECLARE @saldo NUMERIC(18,2)
    DECLARE @idPuntoEmision INT;
    DECLARE @infoAdicional VARCHAR(MAX);
	DECLARE @nroDocOrder VARCHAR(100)

    DECLARE @tbTaxes AS TABLE(
        descripcion VARCHAR(150) NOT NULL
       ,subTotal NUMERIC(18,2) NOT NULL
    )
	
    IF @codDoc = 'FV' OR @codDoc = 'NE'
        BEGIN
             SELECT TOP 1 @saldo = ISNULL(cc.saldo, 0)
	         FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK) 
	         INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
	         INNER JOIN dbo.ComprobanteIngreso       ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
	         INNER JOIN dbo.Cobro                     c WITH (NOLOCK) ON c.idComprobanteIngreso  = ci.idComprobanteIngreso
	         INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
	         WHERE cc.codDoc = IIF(@codDoc = 'FV','01','NE') 
               AND cc.idDocumento = @idDocument 
               AND ci.estado = 1

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
			SELECT top 1 @nroDocOrder = o.Serie  FROM Restaurant.OrderDocument od
			INNER JOIN Restaurant.[Order] o ON o.Id = od.OrderId
			WHERE od.DocumentoId = @idDocument AND O.Enabled =1
            
            SELECT TOP 1 @fechaEmision = fechaEmision, @idPuntoEmision = idPuntoEmision FROM Ventas.v_Factura WITH (NOLOCK) WHERE idFactura = @idDocument

            SET @infoAdicional = (SELECT TOP 1 JSON_QUERY(cd.infoAdicional, '$[0]')
                                    FROM dbo.ConfiguracionDocumento cd
                                    INNER JOIN dbo.TipoDocumento td ON cd.idTipoDocumento = td.idTipoDocumento
                                    WHERE td.codigo = @codDoc
                                        AND cd.idPuntoEmision = @idPuntoEmision
                                        AND JSON_VALUE(cd.infoAdicional, '$[0].valor') IS NOT NULL
                                        AND JSON_VALUE(cd.infoAdicional, '$[0].valor') != ''
                                    );
			SET @header = (
					        SELECT 
					             codDoc = 'FV' 
								,nroDoc = IIF(
									@nroDocOrder IS NOT NULL AND @nroDocOrder <> '',
									de.serieComprobante + ' Nro. Pedido ' + @nroDocOrder,
									de.serieComprobante
 								)
						        ,nroFactura = de.serieComprobante 
						        ,labelNroDoc = 'FACTURA Nro. '
						        ,ambiente = IIF(pe.ambiente=2, 'PRODUCCIÓN', 'PRUEBAS')
						        ,emision = IIF(f.emision=1, 'NORMAL', '')
						        ,codigoAutorizacion = de.claveAcceso
						        ,fechaEmision = CONVERT(NVARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy hh:mm')) 
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
						        ,razonSocialComprador = REPLACE(cu.BusinessName  , '&', '%26')  
						        ,nroIdentificacion = cu.IDCard
						        ,direccionComprador = REPLACE(cl.direccion  , '&', '%26')  
						        ,propina = CAST(f.propina as numeric(15,2))  
						        ,importeTotal = CAST(f.total as numeric(15,2)) 
                                ,CAST(f.subtotalSinImpuestos as numeric(15,2)) as subtotalSinImpuestos
                                ,CAST(f.totalDescuento as numeric(15,2)) as totalDescuentos
                                ,CAST(0 as numeric(18,2))                as ice
						        ,direccion = cl.direccion  
						        ,telefonoCliente = cl.telefono 
						        ,email = cl.correo 
						        ,valorTotal = CAST(f.total as numeric(15,2))
						        ,regimen = UPPER(s.contribuyenteRimpe)
						        ,usuario = u.nombreUsuario
                                ,@saldo saldo
                                ,@infoAdicional additionalInfo
					        FROM dbo.Factura                     f WITH (NOLOCK)
                            INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = f.idDocumentoElectronico
					        INNER JOIN dbo.Usuario               u WITH (NOLOCK) ON u.idUsuario               = f.idUsuario 
                            INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = f.idCliente
                            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision 
                            INNER JOIN Sri.Establecimiento       s WITH (NOLOCK) ON s.idEstablecimiento       = pe.idEstablecimiento
					        INNER JOIN dbo.Entidad               e WITH (NOLOCK) ON e.idEntidad               = s.idEntidad
                            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
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
                            ORDER BY idFacturaDetalle ASC
						    FOR JSON PATH
					      )

            INSERT INTO @tbTaxes (descripcion,subTotal)
            SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
                   ,ISNULL
                   ((
                    SELECT SUM(CAST(fi.TaxBase as numeric(18,2)))
                    FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
                    where fi.FacturaId = @idDocument 
                      AND fi.TaxPercentId = ti.idTipoIva
                      AND fi.[Enabled] = 1

                   ),0) as subTotal
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)

            UNION ALL

             SELECT ti.descripcion as descripcion
                  ,CAST(ISNULL
                  ((
                       SELECT SUM(CAST(fi.TaxBase as numeric(18,2)))
                       FROM Ventas.FacturaImpuesto fi WITH (NOLOCK)
                       where fi.FacturaId = @idDocument 
                         AND fi.TaxPercentId = ti.idTipoIva
                         AND fi.[Enabled] = 1

                  ),0) * porcentaje / 100 as numeric(18,2))
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE ti.porcentaje > 0 
              AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)

            SET @taxesValue = (SELECT * FROM @tbTaxes FOR JSON PATH)

		END 


	IF @codDoc = 'NE'
		BEGIN

			SELECT top 1 @nroDocOrder = o.Serie  FROM Restaurant.OrderDocument od
			INNER JOIN Restaurant.[Order] o ON o.Id = od.OrderId
			WHERE od.DocumentoId = @idDocument AND O.Enabled =1
            
            SELECT TOP 1 @fechaEmision = fechaEmision, @idPuntoEmision = idPuntoEmision FROM dbo.NotaEntrega WITH (NOLOCK) WHERE idNotaEntrega = @idDocument
            
            SET @infoAdicional = (SELECT TOP 1 JSON_QUERY(cd.infoAdicional, '$[0]')
                                    FROM dbo.ConfiguracionDocumento cd
                                    INNER JOIN dbo.TipoDocumento td ON cd.idTipoDocumento = td.idTipoDocumento
                                    WHERE td.codigo = @codDoc
                                        AND cd.idPuntoEmision = @idPuntoEmision
                                        AND JSON_VALUE(cd.infoAdicional, '$[0].valor') IS NOT NULL
                                        AND JSON_VALUE(cd.infoAdicional, '$[0].valor') != ''
                                    );
			SET @header = (SELECT 
							
							 codDoc = 'NE' 

							,nroDoc = IIF(
								@nroDocOrder IS NOT NULL AND @nroDocOrder <> '',
								dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento) + ' Nro. Pedido ' + @nroDocOrder,
								dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento)
							)

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
							,cliente = REPLACE(cu.BusinessName   , '&', '%26')  
							,nroIdentificacion = cu.IDCard
							,direccionCliente = REPLACE(cl.direccion   , '&', '%26')  
							,correoCliente = REPLACE(ISNULL(cl.correo , 'S/N'),';',',')
							,telefonoCliente = REPLACE(ISNULL(cl.telefono, 'S/N'),';',',')
							,ciudad = c.descripcion 
                            ,propina = CAST(ne.propina AS numeric(15,2)) 
							,importeTotal = CAST(ne.total as numeric(15,2))		
							,valorTotal = CAST(ne.total as numeric(15,2))
                            ,CAST(ne.totalDescuento as numeric(15,2)) as totalDescuentos
                            ,CAST(0 as numeric(18,2))                 as ice
                            ,CAST(ne.subtotalSinImpuestos as numeric(15,2)) as subtotalSinImpuestos
							,observacion = ISNULL(ne.observacion, 'S/N')
							,usuario = u.nombreUsuario
                            ,@saldo saldo
                            ,@infoAdicional additionalInfo
						FROM dbo.NotaEntrega ne WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision 
						INNER JOIN Sri.Establecimiento  s WITH (NOLOCK) ON s.idEstablecimiento  = pe.idEstablecimiento
						INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
						LEFT  JOIN dbo.Ciudad           c WITH (NOLOCK) ON c.idCiudad        = cl.idCiudad 
						INNER JOIN dbo.Entidad          e WITH (NOLOCK) ON e.idEntidad       = ne.idEntidad
						INNER JOIN dbo.Usuario          u WITH (NOLOCK) ON u.idUsuario	     = ne.idUsuario
                        INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id             = cl.CustomerId
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
						WHERE ned.idNotaEntrega = @idDocument 
                        AND ned.estado = 1 
                        ORDER BY idNotaEntregaDetalle ASC
                        FOR JSON PATH)
            
            INSERT INTO @tbTaxes (descripcion,subTotal)
            SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
                  ,ISNULL
                  ((
                    SELECT SUM(CAST(ni.TaxBase as numeric(18,2)))
                    FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
                    WHERE ni.NotaEntregaId = @idDocument 
                      AND ni.TaxPercentId = ti.idTipoIva
                      AND ni.[Enabled] = 1

                  ),0) as subTotal
            FROM dbo.TipoIva ti WITH (NOLOCK)
            WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date) 

            INSERT INTO @tbTaxes (descripcion,subTotal)
            SELECT ti.descripcion as descripcion
                  ,CAST(ISNULL
                  ((
                    SELECT SUM(CAST(ni.TaxBase as numeric(18,2)))
                    FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
                    WHERE ni.NotaEntregaId = @idDocument 
                      AND ni.TaxPercentId = ti.idTipoIva
                      AND ni.[Enabled] = 1

                  ),0) * porcentaje / 100 as numeric(18,2)) as iva
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE ti.porcentaje > 0
              AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)

            SET @taxesValue = (SELECT * FROM @tbTaxes FOR JSON PATH)

		END 

	IF @codDoc ='PR'
		BEGIN 
            
            SELECT TOP 1 @fechaEmision = fechaEmision FROM dbo.Proforma WITH (NOLOCK) WHERE idProforma = @idDocument

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
								,razonSocialCliente = REPLACE(cu.BusinessName   , '&', '%26')   
								,nroIdentificacion = cu.IDCard 
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
								,subTotalSinImpuestos = CAST(pr.subTotalSinImpuestos AS numeric(15,2)) 
								,totalDescuentos = CAST(pr.totalDescuento AS numeric(15,2))
                                ,CAST(0 as numeric(18,2))                as ice
								,propina = CAST(pr.propina AS numeric(15,2))  
								,importeTotal = CAST(pr.total AS numeric(15,2))
								,valorTotal = CAST(pr.total AS numeric(15,2))
								,observacion = ISNULL(UPPER(pr.observacion), '')	
							FROM dbo.Proforma pr
							INNER JOIN dbo.PuntoEmision       pe  ON pe.idPuntoEmision       = pr.idPuntoEmision 
							INNER JOIN Sri.Establecimiento    s   ON s.idEstablecimiento              = pe.idEstablecimiento
							INNER JOIN dbo.TipoDocumento      td  ON td.idTipoDocumento      = pr.idTipoDocumento
							INNER JOIN dbo.Cliente            cl  ON cl.idCliente            = pr.idCliente
							 LEFT JOIN dbo.Ciudad             c   ON c.idCiudad              = cl.idCiudad
							INNER JOIN dbo.Entidad            e   ON e.idEntidad             = pr.idEntidad
                            INNER JOIN Customer.Customer     cu WITH (NOLOCK) ON cu.Id             = cl.CustomerId
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
							WHERE prd.idProforma = @idDocument 
                            ORDER BY idProformaDetalle ASC
							FOR JSON PATH)
            
            INSERT INTO @tbTaxes (descripcion,subTotal)
            SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
                    ,ISNULL
                    ((
                    SELECT  CAST(SUM(pr.TaxBase) as numeric(18,2)) 
                    FROM Ventas.ProformaImpuesto pr WITH (NOLOCK) 
                    WHERE pr.ProformaId = @idDocument 
                     AND pr.TaxPercentId = ti.idTipoIva
                     AND pr.[Enabled] = 1

                    ),0) as subTotal
            FROM dbo.TipoIva ti WITH (NOLOCK)
            WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)

            UNION ALL

            SELECT ti.descripcion 
                  ,ISNULL
                  ((
                    SELECT  CAST(SUM(pr.TaxValue) as numeric(18,2)) 
                    FROM Ventas.ProformaImpuesto pr WITH (NOLOCK) 
                    WHERE pr.ProformaId = @idDocument AND pr.TaxPercentId = ti.idTipoIva
                    and pr.[Enabled] = 1

                  ),0) 
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE ti.porcentaje > 0 
              AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)

            SET @taxesValue = (SELECT * FROM @tbTaxes FOR JSON PATH)             
		END 


	IF @codDoc = 'IC' OR @codDoc = 'EC'
		BEGIN 
			SET @header = (	
							SELECT 
								 mc.razonSocial
								,mc.ruc
								,mc.nombreComercial as establecimiento
								,dirMatriz = mc.dirEstablecimiento
								,fechaEmision =  CONVERT(NVARCHAR, FORMAT(mc.fechaEmision, 'dd/MM/yyyy hh:mm')) 						
								,nroDoc= UPPER(mc.tipoDoc) + ' : ' + mc.codDoc + '-'+ mc.estab+ '-'+ dbo.AFTAutoComplete(mc.nroDoc)
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
								,a.nombreFiscal as cliente
                                ,identificacionComprador = a.numeroIdentificacion
								,a.direccionCliente
								,a.telefonoCliente
								,a.entidadFinanciera 
								,a.estadoDoc  
								,'A' as codDoc
								,usuario = a.nombreUsuario
							FROM v_Anticipo a
							WHERE a.idAnticipo = @idDocument
							FOR JSON PATH
				
			)
		END 
 

	SET @dataSources = (SELECT encabezadoDs = @header, detalleDs = @detail, paymentsDs = ISNULL(@payments, '[]'), ISNULL(@taxesValue,'[]') as taxesValue FOR JSON PATH )

	INSERT INTO @table (dataSources) SELECT @dataSources
	RETURN 
END
GO