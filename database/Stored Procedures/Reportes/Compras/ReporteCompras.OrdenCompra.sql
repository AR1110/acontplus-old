USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPOrdenCompraReport]    Script Date: 12/8/2022 12:21:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Emilio Senguana 
-- Create date: 21 de abril del 2022
-- Description:	ASP Reporte Orden de Compra
-- =============================================
IF OBJECT_ID(N'ReporteCompras.OrdenCompra', N'P') IS NOT NULL
DROP PROCEDURE ReporteCompras.OrdenCompra
GO
--exec ReporteCompras.OrdenCompra 38, '{"idOrdenCompra":14}'

CREATE PROCEDURE ReporteCompras.OrdenCompra
	@idRol INT
	,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idOrdenCompra BIGINT
		   ,@idEntidad int = (SELECT idEntidad FROM AFTDataRol(@idRol))
		   
	SELECT 
	idOrdenCompra
	into #tbl
	FROM OPENJSON(@json)
	WITH (idOrdenCompra BIGINT '$.idOrdenCompra'   
	) AS jsonValues 
	
	SELECT @idOrdenCompra = idOrdenCompra FROM dbo.#tbl
		
	SELECT 
	     dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,oc.nroDocumento) nroDocumento
		,e.razonSocial as razonSocialEntidad
		,e.nombreComercial as nombreComercialEntidad
		,e.ruc as rucEntidad
		,ISNULL(e.direccion, 'S/N') as direccionEntidad
		,ISNULL(e.telefono, 'S/N') as telefonoEntidad
		,ISNULL(e.email, 'S/N') as correoEntidad
		,prov.numeroIdentificacion as nroIdentificacionProveedor
		,prov.nombreFiscal as nombreFiscalProveedor
		,prov.nombreComercial as nombreComercialProveedor			
		,ISNULL(prov.direccion, 'S/N') as direccionProveedor
		,ISNULL(prov.correo, 'S/N') as correoProveedor
		,ISNULL(prov.telefono, 'S/N') as telefonoProveedor
		,CONVERT(NVARCHAR, FORMAT(oc.fechaEmision, 'dd/MM/yyyy hh:mm:ss'),106) as fechaEmision		
		,CAST(oc.subTotalSinImpuestos AS numeric(15,2)) AS subTotalSinImpuestos
		,CAST(oc.subTotalIva  AS  numeric(15,2)) as subTotalIva12
		,CAST(oc.subTotalNoObjetoIva AS numeric(15,2)) as subTotalNoObjetoIva
		,CAST(oc.subTotalIvaCero AS numeric(15,2)) as subTotalIva0
		,CAST(oc.subTotalExentoIva AS numeric(15,2)) as subtotalExcentoIva
		,CAST(oc.totalIce AS numeric(15,2))  as ice
		,CAST(oc.irbpnr AS numeric(15,2)) as irbpnr			
		,CAST(oc.totalDescuento AS numeric(15,2)) as totalDescuento
		,'IVA 12%' as tipoIva
		,CAST(oc.iva AS numeric(15,2))  as iva12
		,CAST(oc.propina AS numeric(15,2))  as propina 
		,CAST(oc.total AS numeric(15,2)) as importeTotal 
	FROM dbo.OrdenCompra oc	
	INNER JOIN dbo.Entidad           e ON e.idEntidad       = oc.idEntidad
	INNER JOIN dbo.PuntoEmision     pe ON pe.idPuntoEmision = oc.idPuntoEmision
	INNER JOIN Sri.Establecimiento   s ON s.codEstab        = pe.codEstab
	INNER JOIN dbo.Proveedor      prov ON prov.idProveedor  = oc.idProveedor
	WHERE oc.idOrdenCompra = @idOrdenCompra

	SELECT 
		 a.codigo as codigo
		,ocd.cantidad 
		,ocd.descripcion 
		,m.descripcion as medida
		,ti.descripcion as tipoIva
		,ocd.precioCosto as precioUnitario
		,ocd.valorDescuento as valorDescuento
		,b.descripcion as bodega
		,ocd.total as precioTotal			
	FROM OrdenCompraDetalle ocd		
	INNER JOIN Medida m ON m.idMedida = ocd.idMedida		
	INNER JOIN Articulo a ON a.idArticulo = ocd.idArticulo 
	INNER JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
	INNER JOIN Bodega b ON b.idBodega = ocd.idBodega
	WHERE ocd.idOrdenCompra = @idOrdenCompra
END
