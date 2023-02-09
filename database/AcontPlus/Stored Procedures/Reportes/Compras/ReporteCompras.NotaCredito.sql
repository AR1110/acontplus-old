USE [AcontPlus]
GO
/****** Object:  StoredProcedure [ReporteCompras].[NotaCredito]    Script Date: 12/8/2022 12:02:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID(N'ReporteCompras.NotaCredito', N'P') IS NOT NULL
DROP PROCEDURE ReporteCompras.NotaCredito
GO

CREATE PROCEDURE ReporteCompras.NotaCredito
	 @idRol INT 
	,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idTipoAmbiente int 
		   ,@idNotaCreditoProveedor BIGINT
		   ,@idEntidad int = (SELECT idEntidad FROM AFTDataRol(@idRol))
		   ,@claveAcceso nvarchar(50) 
		   ,@idTipoDocumento bigint 
		   ,@nroPrecio INT
		   ,@nroCantidad INT
	       ,@nroIva INT
	       ,@nroDescuentoDetalle INT
	       ,@nroTotalDetalle INT
	       ,@nroTotalSubTotal INT
	       ,@nroDescuento INT
	       ,@nroIce INT

	SELECT @idNotaCreditoProveedor = idNotaCreditoProveedor FROM OPENJSON(@json)WITH (idNotaCreditoProveedor BIGINT '$.idNotaCreditoProveedor') AS jsonValues 

	SELECT 
		@idTipoDocumento = idTipoDocumento 
	FROM dbo.NotaCreditoProveedor 
	WHERE idNotaCreditoProveedor= @idNotaCreditoProveedor

	SELECT 
		@nroPrecio = nroPrecio
	   ,@nroCantidad = nroCantidad
	   ,@nroIva = nroIva
	   ,@nroDescuentoDetalle = nroDescuentoDetalle
	   ,@nroTotalDetalle = nroTotalDetalle
	   ,@nroTotalSubTotal = nroTotalSubTotal
	   ,@nroDescuento = nroDescuento
	   ,@nroIce = nroIce
	FROM Config.CantidadDecimal WHERE idEntidad = @idEntidad AND codTransaccion = 'C'

	SELECT 
		 nroDocumento           = dbo.AFTGenerarNroDocumento(ncp.ptoEmision,ncp.nroDoc)												
		,razonSocialEntidad     = e.razonSocial
		,nombreComercialEntidad = e.nombreComercial
		,rucEntidad             = e.ruc
		,telefonoEntidad        = e.telefono
		,correoEntidad			= e.email														
		,direccionEntidad       = e.direccion								
		,obligadoLlevarContabilidad = es.obligadoContabilidad
		,nroIdentificacionProveedor = prov.numeroIdentificacion
		,nombreFiscalProveedor		= prov.nombreFiscal
		,correoProveedor			= ISNULL(prov.correo, 'S/N')
		,telefonoProveedor			= ISNULL(prov.telefono, 'S/N')
		,direccionProveedor			= ISNULL(prov.direccion, 'S/N')
		,subTotalNetoIva			= Herramientas.Round_Out(ncp.subTotalNetoIva,@nroTotalSubTotal)
		,subTotalIva12				= Herramientas.Round_Out(ncp.subTotalIva,@nroTotalSubTotal)
		,subTotalNoObjetoIva		= Herramientas.Round_Out(ncp.subTotalNoObjetoIva,@nroTotalSubTotal)
		,subTotalIva0				= Herramientas.Round_Out(ncp.subTotalIvaCero,@nroTotalSubTotal)
		,subtotalExcentoIva			= Herramientas.Round_Out(ncp.subTotalExentoIva,@nroTotalSubTotal)
		,ice						= Herramientas.Round_Out(ncp.totalIce,@nroIce)
		,irbpnr						= CAST(ncp.irbpnr AS numeric(15,2))
		,subTotalSinImpuestos		=  Herramientas.Round_Out(ncp.subTotalSinImpuestos,@nroTotalSubTotal)
		,totalDescuento				= Herramientas.Round_Out(ncp.totalDescuento,@nroDescuento)
		,iva12						= Herramientas.Round_Out(ncp.iva,@nroIva)
		,propina					= CAST(ncp.propina AS numeric(15,2)) 
		,importeTotal				= Herramientas.Round_Out(ncp.total,@nroTotalSubTotal)			
		,fechaEmision				= CONVERT(NVARCHAR, FORMAT(ncp.fechaEmision, 'dd/MM/yyyy hh:mm:ss')) 												
	FROM dbo.NotaCreditoProveedor ncp				
	INNER JOIN Sri.Establecimiento     es ON es.codEstab             = ncp.codEstab		
	INNER JOIN dbo.Proveedor         prov ON prov.idProveedor        = ncp.idProveedor			
	INNER JOIN dbo.Entidad              e ON e.idEntidad             = ncp.idEntidad	
	INNER JOIN Config.GestionSistema     c ON c.idEntidad            = e.idEntidad	
	INNER JOIN dbo.SubContribuyente    sc ON sc.idSubContribuyente   = prov.idSubContribuyente	
	WHERE ncp.idNotaCreditoProveedor = @idNotaCreditoProveedor;

	SELECT 
		 codigo = a.codigo
		,cantidad = Herramientas.Round_Out(ncpd.cantidad,@nroCantidad)
		,descripcion = ncpd.descripcion
		,precioUnitario =  Herramientas.Round_Out(ncpd.precioUnitario,@nroPrecio) 
		,valorDescuento = Herramientas.Round_Out(ncpd.valorDescuento,@nroDescuentoDetalle)
		,precioTotal =  Herramientas.Round_Out(ncpd.total,@nroTotalDetalle)		
		,medida = m.descripcion
	FROM NotaCreditoProveedorDetalle ncpd 		
	INNER JOIN Articulo a ON a.idArticulo = ncpd.idArticulo 
	INNER JOIN Medida   m ON m.idMedida   = a.idMedida
	WHERE ncpd.idNotaCreditoProveedor = @idNotaCreditoProveedor AND ncpd.estado = 1
END 