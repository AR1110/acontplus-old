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
ALTER FUNCTION ApiPrinter.Document_Data 
(
	-- Add the parameters for the function here
	@idDocument INT 
   ,@idTipoDocumento INT
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
	DECLARE @formaPago VARCHAR(100)
	DECLARE @pago DECIMAL(15,2)
    DECLARE @cambio DECIMAL(15,2)
	
	SELECT TOP 1
		 @pago =  ci.total
		,@cambio = ci.cambio
		,@formaPago = ef.descripcion
	FROM 
	dbo.CobroDocumento cd WITH (NOLOCK) 
	INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = cd.idComprobanteIngreso
	INNER JOIN dbo.Cobro               c WITH (NOLOCK) ON c.idComprobanteIngreso  = ci.idComprobanteIngreso
	INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
	WHERE cd.idTipoDocumento = @idTipoDocumento AND cd.idComprobante = @idDocument AND ci.estado = 1

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
						,fechaVencimiento = CONVERT(NVARCHAR,FORMAT(f.fechaVencimiento, 'dd/MM/yyyy'))   
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
						,subTotalNetoIva = CAST(f.subTotalNetoIva as numeric(15,2))
						,subTotalIva12 = CAST(f.subTotalIva as numeric(15,2))
						,subTotalNoObjetoIva = CAST(f.subTotalNoObjetoIva as numeric(15,2))
						,subTotalIva0 = CAST(f.subTotalIvaCero as numeric(15,2))
						,subtotalExcentoIva = CAST(f.subTotalExentoIva as numeric(15,2))
						,ice = CAST(f.totalIce as numeric(15,2))
						,irbpnr = CAST(f.irbpnr as numeric(15,2))
						,subTotalSinImpuestos = CAST(f.subTotalSinImpuestos as numeric(15,2))
						,totalDescuentos = CAST(f.totalDescuento as numeric(15,2))
						,iva12 = CAST(f.iva as numeric(15,2))
						,propina = CAST(f.propina as numeric(15,2))  
						,importeTotal = CAST(f.total as numeric(15,2)) 
						,direccion = cl.direccion  
						,telefonoCliente = cl.telefono 
						,email = cl.correo 
						,valorTotal = CAST(f.total as numeric(15,2))
						,regimen = UPPER(s.contribuyenteRimpe)
						,tipoIva = 'IVA 12' 
						,porcentajeIva = 'SUBTOTAL '+CAST(CAST(f.porcentaje AS numeric(15,0)) AS nvarchar)+'%'
						,usuario = u.nombreUsuario
						,pago = ISNULL(@pago,0)
						,cambio = ISNULL(@cambio,0)
						,formaPago = IIF(@formaPago Is NULL,'Cobro:','Cobro:'+ SUBSTRING(@formaPago,0, 9))
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
							,precioUnitario = CAST(fd.precioVenta as numeric(15,2))
							,valorDescuento = CAST(fd.valorDescuento as numeric(15,2)) 
							,precioTotal    = CAST(fd.total as numeric(15,2))
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
							,email = s.correo 
							,telefonoEntidad = ISNULL(s.telefono, 'SN') 
							,fechaEmision = CONVERT(NVARCHAR, FORMAT(ne.fechaEmision, 'dd/MM/yyyy hh:mm')) 
							,fechaVencimiento = CONVERT(NVARCHAR, FORMAT(ne.fechaVencimiento, 'dd/MM/yyyy hh:mm')) 
							,s.dirEstablecimiento  
							,s.contribuyenteEspecial
						    ,s.obligadoContabilidad

							,cliente = REPLACE(cl.nombreFiscal   , '&', '%26')  
							,nroIdentificacion = cl.numeroIdentificacion
							,direccionCliente = REPLACE(cl.direccion   , '&', '%26')  
							,correoCliente = REPLACE(ISNULL(cl.correo , 'S/N'),';',',')
							,telefonoCliente = REPLACE(ISNULL(cl.telefono, 'S/N'),';',',')
							,ciudad = c.descripcion 
							,subTotalNetoIva = CAST(ne.subTotalNetoIva as numeric(15,2))
							,subTotalIva12 = CAST(ne.subTotalIva as numeric(15,2))
							,subTotalNoObjetoIva = CAST(ne.subTotalNoObjetoIva as numeric(15,2))
							,subTotalIva0 = CAST(ne.subTotalIvaCero as numeric(15,2))
							,subtotalExcentoIva = CAST(ne.subTotalExentoIva as numeric(15,2))
							,ice  = CAST(ne.totalIce as numeric(15,2))
							,irbpnr = CAST(ne.irbpnr AS numeric(15,2))
							,subTotalSinImpuestos = CAST(ne.subTotalSinImpuestos as numeric(15,2))
							,totalDescuentos = CAST(ne.totalDescuento as numeric(15,2))
							,iva12 = CAST(ne.iva AS numeric(15,2))
							,propina = CAST(ne.propina AS numeric(15,2)) 
							,importeTotal = CAST(ne.total as numeric(15,2))		
							,valorTotal = CAST(ne.total as numeric(15,2))
							,observacion = ISNULL(ne.observacion, 'S/N') 
							,tipoIva = 'IVA 12'
							,porcentajeIva = 'subTotal '+CAST(CAST(ne.tarifa AS numeric(15,0)) AS nvarchar)+'%'
							,usuario = u.nombreUsuario
							,pago = ISNULL(@pago,0)
							,cambio = ISNULL(@cambio,0)
							,formaPago = IIF(@formaPago Is NULL,'Cobro:','Cobro:'+  SUBSTRING(@formaPago,0, 9))
						FROM dbo.NotaEntrega ne WITH (NOLOCK)
						INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision 
						INNER JOIN Sri.Establecimiento  s WITH (NOLOCK) ON s.codEstab        = pe.codEstab
						INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
						LEFT  JOIN dbo.Ciudad           c WITH (NOLOCK) ON c.idCiudad        = cl.idCiudad 
						INNER JOIN dbo.Entidad          e WITH (NOLOCK) ON e.idEntidad       = ne.idEntidad
						INNER JOIN dbo.Usuario          u WITH (NOLOCK) ON u.idUsuario	     = ne.idUsuario
						WHERE ne.idNotaEntrega = @idDocument FOR JSON PATH )

			SET @detail = (SELECT 
							 codigo = a.codigo
							,cantidad = CAST(ned.cantidad AS numeric(15,2))
							,descripcion = REPLACE(ned.descripcion, '#', '%23')
							,precioUnitario = CAST(ned.precioVenta AS numeric(15,2))
							,valorDescuento = CAST(ned.valorDescuento AS numeric(15,2))
							,precioTotal = CAST(ned.total AS numeric(15,2)) 
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
								,subTotalNetoIva = CAST(pr.subTotalNetoIva AS numeric(15,2)) 
								,subTotalIva12   =  CAST(pr.subTotalIva AS numeric(15,2)) 
								,subTotalNoObjetoIva =  CAST(pr.subTotalNoObjetoIva AS numeric(15,2)) 
								,subTotalIva0 =  CAST(pr.subTotalIvaCero AS numeric(15,2))
								,subtotalExcentoIva = CAST(pr.subTotalExentoIva AS numeric(15,2))
								,ice = CAST(pr.totalIce AS numeric(15,2)) 
								,irbpnr = CAST(pr.irbpnr AS numeric(15,2))
								,subTotalSinImpuestos = CAST(pr.subTotalSinImpuestos AS numeric(15,2)) 
								,totalDescuentos = CAST(pr.totalDescuento AS numeric(15,2))
								,iva12 = CAST(pr.iva AS numeric(15,2)) 
								,propina = CAST(pr.propina AS numeric(15,2))  
								,importeTotal = CAST(pr.total AS numeric(15,2))
								,valorTotal = CAST(pr.total AS numeric(15,2))
								,observacion = ISNULL(UPPER(pr.observacion), '')		
								,porcentajeIva = 'SUBTOTAL IVA '+CAST(CAST(pr.tarifa AS numeric(15,0)) AS nvarchar)+'%'
								,tipoIva = 'IVA '+CAST(CAST(pr.tarifa AS numeric(15,0)) AS nvarchar)+'%'
						
							FROM dbo.Proforma pr
							INNER JOIN dbo.PuntoEmision       pe  ON pe.idPuntoEmision       = pr.idPuntoEmision 
							INNER JOIN Sri.Establecimiento    s   ON s.codEstab              = pe.codEstab
							INNER JOIN dbo.TipoDocumento      td  ON td.idTipoDocumento      = pr.idTipoDocumento
							INNER JOIN dbo.Cliente            cl  ON cl.idCliente            = pr.idCliente
							INNER JOIN dbo.TipoIdentificacion ti  ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
							 LEFT JOIN dbo.Ciudad             c   ON c.idCiudad              = cl.idCiudad
							INNER JOIN dbo.Entidad            e   ON e.idEntidad             = pr.idEntidad
							INNER JOIN dbo.TipoIva            tiv ON  tiv.idTipoIva          = pr.idTipoIva
							WHERE pr.idProforma = @idDocument FOR JSON PATH  
						)

			 SET @detail = (SELECT 
								 codigo = a.codigo
								,cantidad = CAST(prd.cantidad as numeric(15,2)) 
								,descripcion = REPLACE(prd.descripcion, '#', '%23')
								,precioUnitario = CAST(prd.precioUnitario as numeric(15,2))
								,precioTotal = CAST(prd.total as numeric(15,2))
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
								,mc.entregadoPor
								,mc.recibidoPor
								,entidadFinanciera = UPPER(mc.entidadFinanciera)
								,valorTotal = convert(numeric(18,2), mc.valor)
								,observacion = UPPER(mc.observacion)
								,usuario	
							FROM v_movimiento_caja mc
							WHERE idMovimientoCaja = @idDocument
							FOR JSON PATH
				
			)
		END 
 

	SET @dataSources = (SELECT encabezadoDs = @header, detalleDs = @detail FOR JSON PATH )

	INSERT INTO @table (dataSources) SELECT @dataSources

	RETURN 
END
GO